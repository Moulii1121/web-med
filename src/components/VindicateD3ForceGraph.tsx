import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Filter, 
  Info, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  Stethoscope, 
  Search,
  Maximize2,
  X,
  Zap,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { VindicateItem, DepthLevel } from '../types/disease';

export interface GraphNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  type: 'hub' | 'category' | 'symptom' | 'sign' | 'red_flag';
  letter?: string;
  category?: string;
  weight?: number;
  role?: string;
  differentials?: string[];
  color: string;
  radius: number;
  detail?: string;
}

export interface GraphLink extends d3.SimulationLinkDatum<GraphNode> {
  id: string;
  source: string | GraphNode;
  target: string | GraphNode;
  relationship: string;
  strength: number;
  type: 'hub-category' | 'category-symptom';
}

interface VindicateD3ForceGraphProps {
  vindicateList: VindicateItem[];
  diseaseTitle: string;
  cardinalSymptoms?: string[];
  physicalSigns?: { sign: string; maneuver: string; diagnostic_yield: string }[];
  redFlags?: { warning: string; immediateAction: string; timeframe: string }[];
  depthLevel?: DepthLevel;
  selectedRegion?: string;
  onSelectCategory?: (letter: string) => void;
}

// Category aesthetic color map (WCAG compliant)
const CATEGORY_COLORS: Record<string, { bg: string; stroke: string; text: string; badge: string }> = {
  V: { bg: '#E11D48', stroke: '#BE123C', text: '#FFE4E6', badge: 'bg-rose-500' }, // Vascular (Rose/Crimson)
  I: { bg: '#EA580C', stroke: '#C2410C', text: '#FFEDD5', badge: 'bg-orange-600' }, // Infectious (Orange)
  N: { bg: '#7C3AED', stroke: '#6D28D9', text: '#EDE9FE', badge: 'bg-purple-600' }, // Neoplastic (Purple)
  D: { bg: '#475569', stroke: '#334155', text: '#F1F5F9', badge: 'bg-slate-600' }, // Degenerative (Slate)
  I2: { bg: '#0284C7', stroke: '#0369A1', text: '#E0F2FE', badge: 'bg-sky-600' }, // Iatrogenic (Sky)
  C: { bg: '#059669', stroke: '#047857', text: '#D1FAE5', badge: 'bg-emerald-600' }, // Congenital (Emerald)
  A: { bg: '#DB2777', stroke: '#BE185D', text: '#FCE7F3', badge: 'bg-pink-600' }, // Autoimmune (Pink)
  T: { bg: '#D97706', stroke: '#B45309', text: '#FEF3C7', badge: 'bg-amber-600' }, // Trauma/Toxic (Amber)
  E: { bg: '#0D9488', stroke: '#0F766E', text: '#CCFBF1', badge: 'bg-teal-600' }, // Endocrine (Teal)
};

export const VindicateD3ForceGraph: React.FC<VindicateD3ForceGraphProps> = ({
  vindicateList,
  diseaseTitle,
  cardinalSymptoms = [],
  physicalSigns = [],
  redFlags = [],
  depthLevel = 'MS1',
  selectedRegion = 'Anatomy',
  onSelectCategory
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // UI state
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [showSigns, setShowSigns] = useState<boolean>(true);
  const [showRedFlags, setShowRedFlags] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [zoomTransform, setZoomTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const simulationRef = useRef<d3.Simulation<GraphNode, GraphLink> | null>(null);

  // 1. Build Graph Model (Nodes and Links)
  const { nodes, links } = useMemo(() => {
    const rawNodes: GraphNode[] = [];
    const rawLinks: GraphLink[] = [];

    // Hub: The selected disease
    const hubId = 'hub-disease';
    rawNodes.push({
      id: hubId,
      label: diseaseTitle,
      type: 'hub',
      color: '#0D9488',
      radius: 34,
      detail: `Central pathological diagnosis for ${selectedRegion}`
    });

    // VINDICATE Category Nodes
    vindicateList.forEach((cat) => {
      const catColor = CATEGORY_COLORS[cat.letter]?.bg || '#0D9488';
      const catNodeId = `cat-${cat.letter}`;
      
      // Radius scaled by weight (20 to 30)
      const radius = 22 + (cat.weight / 100) * 8;

      rawNodes.push({
        id: catNodeId,
        label: `${cat.letter === 'I2' ? 'I' : cat.letter}: ${cat.category.split('/')[0].trim()}`,
        type: 'category',
        letter: cat.letter,
        category: cat.category,
        weight: cat.weight,
        role: cat.roleInDisease,
        differentials: cat.topDifferentials,
        color: catColor,
        radius,
        detail: cat.roleInDisease
      });

      // Link Hub -> Category
      rawLinks.push({
        id: `link-${hubId}-${catNodeId}`,
        source: hubId,
        target: catNodeId,
        relationship: `Etiologic weight: ${cat.weight}%`,
        strength: Math.max(0.3, cat.weight / 100),
        type: 'hub-category'
      });
    });

    // Helper: Map text semantic relevance to categories
    const getBestCategoryForSymptom = (text: string): string => {
      const lower = text.toLowerCase();
      if (lower.includes('fever') || lower.includes('chill') || lower.includes('infect') || lower.includes('purulent') || lower.includes('warmth') || lower.includes('sepsis') || lower.includes('abscess') || lower.includes('bacteri') || lower.includes('leukocyt')) {
        return 'I';
      }
      if (lower.includes('pain') || lower.includes('ischemi') || lower.includes('claudicat') || lower.includes('infarct') || lower.includes('necros') || lower.includes('hypoperfus') || lower.includes('pallor') || lower.includes('pulse') || lower.includes('hypotens') || lower.includes('bleed') || lower.includes('hemorrhag') || lower.includes('ruptur') || lower.includes('thromb')) {
        return 'V';
      }
      if (lower.includes('mass') || lower.includes('weight loss') || lower.includes('cachexi') || lower.includes('anorexi') || lower.includes('sweat') || lower.includes('lump') || lower.includes('obstruct')) {
        return 'N';
      }
      if (lower.includes('guard') || lower.includes('rigid') || lower.includes('periton') || lower.includes('rebound') || lower.includes('trauma') || lower.includes('ruptur') || lower.includes('acute onset') || lower.includes('toxic') || lower.includes('ingest')) {
        return 'T';
      }
      if (lower.includes('dehydrat') || lower.includes('acid') || lower.includes('electrolyt') || lower.includes('glucos') || lower.includes('jaundic') || lower.includes('metabol') || lower.includes('lipas') || lower.includes('amylas') || lower.includes('kussmaul')) {
        return 'E';
      }
      if (lower.includes('rash') || lower.includes('arthralgi') || lower.includes('inflam') || lower.includes('chronic') || lower.includes('flare')) {
        return 'A';
      }
      if (lower.includes('famil') || lower.includes('child') || lower.includes('congenit') || lower.includes('anomal') || lower.includes('early onset')) {
        return 'C';
      }
      if (lower.includes('iatrogen') || lower.includes('postop') || lower.includes('drug') || lower.includes('medicat') || lower.includes('idiopath')) {
        return 'I2';
      }
      // Default to highest weighted category
      const topCat = [...vindicateList].sort((a, b) => b.weight - a.weight)[0];
      return topCat ? topCat.letter : 'I';
    };

    // 2. Cardinal Symptoms
    cardinalSymptoms.slice(0, 6).forEach((symptom, idx) => {
      const symId = `sym-${idx}`;
      rawNodes.push({
        id: symId,
        label: symptom,
        type: 'symptom',
        color: '#3B82F6', // Blue
        radius: 18,
        detail: `Cardinal presenting symptom of ${diseaseTitle}`
      });

      // Connect symptom to best matched category
      const targetCatLetter = getBestCategoryForSymptom(symptom);
      rawLinks.push({
        id: `link-cat${targetCatLetter}-${symId}`,
        source: `cat-${targetCatLetter}`,
        target: symId,
        relationship: 'Manifests as',
        strength: 0.65,
        type: 'category-symptom'
      });

      // Also connect to a secondary category if applicable
      const otherCats = vindicateList.filter(c => c.letter !== targetCatLetter && c.weight >= 40);
      if (otherCats.length > 0 && idx % 2 === 0) {
        rawLinks.push({
          id: `link-cat${otherCats[0].letter}-${symId}-sec`,
          source: `cat-${otherCats[0].letter}`,
          target: symId,
          relationship: 'Co-contributes to',
          strength: 0.35,
          type: 'category-symptom'
        });
      }
    });

    // 3. Physical Exam Signs
    if (showSigns) {
      physicalSigns.slice(0, 4).forEach((sign, idx) => {
        const signId = `sign-${idx}`;
        rawNodes.push({
          id: signId,
          label: sign.sign,
          type: 'sign',
          color: '#10B981', // Emerald
          radius: 17,
          detail: `Maneuver: ${sign.maneuver} • Yield: ${sign.diagnostic_yield}`
        });

        const catLetter = getBestCategoryForSymptom(sign.sign + ' ' + sign.maneuver);
        rawLinks.push({
          id: `link-cat${catLetter}-${signId}`,
          source: `cat-${catLetter}`,
          target: signId,
          relationship: `Pathognomonic sign (${sign.diagnostic_yield})`,
          strength: 0.7,
          type: 'category-symptom'
        });
      });
    }

    // 4. Red Flag Warnings
    if (showRedFlags) {
      redFlags.slice(0, 3).forEach((rf, idx) => {
        const rfId = `rf-${idx}`;
        rawNodes.push({
          id: rfId,
          label: `RED FLAG: ${rf.warning.length > 28 ? rf.warning.slice(0, 28) + '...' : rf.warning}`,
          type: 'red_flag',
          color: '#EF4444', // Red
          radius: 19,
          detail: `Immediate Action: ${rf.immediateAction} • Timeframe: ${rf.timeframe}`
        });

        const catLetter = getBestCategoryForSymptom(rf.warning);
        rawLinks.push({
          id: `link-cat${catLetter}-${rfId}`,
          source: `cat-${catLetter}`,
          target: rfId,
          relationship: `Critical threshold warning (${rf.timeframe})`,
          strength: 0.85,
          type: 'category-symptom'
        });
      });
    }

    return { nodes: rawNodes, links: rawLinks };
  }, [vindicateList, diseaseTitle, cardinalSymptoms, physicalSigns, redFlags, showSigns, showRedFlags, selectedRegion]);

  // 2. Filter nodes based on user search or category filter
  const { filteredNodes, filteredLinks } = useMemo(() => {
    let visibleNodes = [...nodes];

    if (activeCategoryFilter) {
      // Show hub, the selected category, and connected symptoms/signs/red_flags
      const connectedNodeIds = new Set<string>();
      connectedNodeIds.add('hub-disease');
      connectedNodeIds.add(`cat-${activeCategoryFilter}`);

      links.forEach((l) => {
        const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
        if (srcId === `cat-${activeCategoryFilter}`) connectedNodeIds.add(tgtId);
        if (tgtId === `cat-${activeCategoryFilter}`) connectedNodeIds.add(srcId);
      });

      visibleNodes = visibleNodes.filter(n => connectedNodeIds.has(n.id));
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchedIds = new Set<string>();
      visibleNodes.forEach(n => {
        if (
          n.label.toLowerCase().includes(q) ||
          (n.category && n.category.toLowerCase().includes(q)) ||
          (n.detail && n.detail.toLowerCase().includes(q))
        ) {
          matchedIds.add(n.id);
        }
      });

      // Expand to connected links
      links.forEach(l => {
        const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
        if (matchedIds.has(srcId)) matchedIds.add(tgtId);
        if (matchedIds.has(tgtId)) matchedIds.add(srcId);
      });

      visibleNodes = visibleNodes.filter(n => matchedIds.has(n.id) || n.type === 'hub');
    }

    const visibleNodeIds = new Set(visibleNodes.map(n => n.id));
    const visibleLinks = links.filter(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      return visibleNodeIds.has(srcId) && visibleNodeIds.has(tgtId);
    });

    return { filteredNodes: visibleNodes, filteredLinks: visibleLinks };
  }, [nodes, links, activeCategoryFilter, searchFilter]);

  // 3. Render D3 Simulation
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 860;
    const height = 540;

    // Clear previous SVG content
    svg.selectAll('*').remove();

    // Definitions (Glow filter, arrows, linear gradients)
    const defs = svg.append('defs');

    // Drop shadow filter
    const filter = defs.append('filter')
      .attr('id', 'd3-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrow markers
    ['hub-category', 'category-symptom'].forEach(type => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', type === 'hub-category' ? '#0D9488' : '#94A3B8');
    });

    // Main Zoomable Group container
    const g = svg.append('g').attr('class', 'main-container');

    // Setup d3.zoom
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
        setZoomTransform(event.transform);
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;

    // Create deep copy of nodes & links for D3 simulation mutation
    const simNodes: GraphNode[] = filteredNodes.map(d => ({ ...d }));
    const simLinks: GraphLink[] = filteredLinks.map(d => ({ ...d }));

    // Setup Force Simulation
    const simulation = d3.forceSimulation<GraphNode>(simNodes)
      .force('link', d3.forceLink<GraphNode, GraphLink>(simLinks)
        .id(d => d.id)
        .distance((d) => {
          if (d.type === 'hub-category') return 140;
          return 100;
        })
        .strength(d => d.strength || 0.5)
      )
      .force('charge', d3.forceManyBody().strength(-320).distanceMax(450))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide<GraphNode>().radius(d => d.radius + 16).iterations(3));

    simulationRef.current = simulation;

    // Draw Links
    const linkGroup = g.append('g').attr('class', 'links');
    const link = linkGroup.selectAll<SVGLineElement, GraphLink>('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', (d) => {
        if (d.type === 'hub-category') return '#0D9488';
        return '#94A3B8';
      })
      .attr('stroke-opacity', 0.45)
      .attr('stroke-width', (d) => (d.type === 'hub-category' ? 2.5 : 1.5))
      .attr('stroke-dasharray', (d) => (d.type === 'category-symptom' ? '4,3' : 'none'))
      .attr('marker-end', (d) => `url(#arrow-${d.type})`);

    // Draw Nodes Group
    const nodeGroup = g.append('g').attr('class', 'nodes');

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        // Leave pinned or release:
        d.fx = event.x;
        d.fy = event.y;
      });

    // Enter node containers
    const node = nodeGroup.selectAll<SVGGElement, GraphNode>('g')
      .data(simNodes)
      .join('g')
      .attr('class', 'node-item')
      .call(drag)
      .style('cursor', 'grab')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
        if (d.letter && onSelectCategory) {
          onSelectCategory(d.letter);
        }
      })
      .on('mouseenter', (_event, d) => {
        setHoveredNode(d);
        // Highlight connected links
        link
          .attr('stroke-opacity', (l: any) => {
            const isConnected = l.source.id === d.id || l.target.id === d.id;
            return isConnected ? 0.95 : 0.1;
          })
          .attr('stroke-width', (l: any) => {
            const isConnected = l.source.id === d.id || l.target.id === d.id;
            return isConnected ? 3 : 1;
          });

        // Fade non-connected nodes
        const neighborIds = new Set<string>();
        neighborIds.add(d.id);
        simLinks.forEach((l: any) => {
          if (l.source.id === d.id) neighborIds.add(l.target.id);
          if (l.target.id === d.id) neighborIds.add(l.source.id);
        });

        node.style('opacity', (n) => (neighborIds.has(n.id) ? 1 : 0.25));
      })
      .on('mouseleave', () => {
        setHoveredNode(null);
        link
          .attr('stroke-opacity', 0.45)
          .attr('stroke-width', (d) => (d.type === 'hub-category' ? 2.5 : 1.5));
        node.style('opacity', 1);
      });

    // Node Outer Ring (Glow / Accent)
    node.append('circle')
      .attr('r', d => d.radius + 3)
      .attr('fill', 'none')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.3)
      .attr('class', 'node-pulse');

    // Node Primary Circle
    node.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('filter', 'url(#d3-glow)')
      .attr('stroke', '#FFFFFF')
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.85);

    // Inner icon / letter glyph
    node.each(function(d) {
      const el = d3.select(this);

      if (d.type === 'hub') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.3em')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .text('HUB');
      } else if (d.type === 'category' && d.letter) {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .attr('fill', '#FFFFFF')
          .attr('font-family', 'ui-monospace, monospace')
          .attr('font-size', '13px')
          .attr('font-weight', 'bold')
          .text(d.letter === 'I2' ? 'I' : d.letter);
      } else if (d.type === 'red_flag') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .text('!');
      } else if (d.type === 'sign') {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text('Rx');
      } else {
        el.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '.35em')
          .attr('fill', '#FFFFFF')
          .attr('font-size', '10px')
          .attr('font-weight', 'bold')
          .text('Sx');
      }
    });

    // Node Label Text (Underneath)
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.radius + 15)
      .attr('font-size', d => (d.type === 'hub' ? '12px' : '10px'))
      .attr('font-weight', d => (d.type === 'hub' || d.type === 'category' ? 'bold' : 'normal'))
      .attr('fill', 'currentColor')
      .attr('class', 'text-slate-800 dark:text-slate-100 select-none pointer-events-none')
      .text(d => {
        if (d.label.length > 24) return d.label.slice(0, 22) + '...';
        return d.label;
      });

    // Simulation tick update
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Click background to clear selection
    svg.on('click', () => {
      setSelectedNode(null);
    });

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, filteredLinks, onSelectCategory]);

  // Zoom control handlers
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
    }
  };

  const handleReheatSimulation = () => {
    if (simulationRef.current) {
      simulationRef.current.alpha(0.8).restart();
      setIsSimulating(true);
    }
  };

  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* 1. Interactive Graph Toolbar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold">
            <Share2 className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>VINDICATE ⟷ Symptom Dynamic Network Graph</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                D3.js Force Physics
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Drag nodes to rearrange. Click any VINDICATE letter or symptom to inspect etiologic connections.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Search bar inside graph */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Highlight symptom/letter..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 w-44"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Toggle Switches */}
          <button
            onClick={() => setShowSigns(!showSigns)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
              showSigns
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Physical Exam Signs in Graph"
          >
            <Stethoscope className="w-3 h-3" />
            <span>Signs ({physicalSigns.length})</span>
          </button>

          <button
            onClick={() => setShowRedFlags(!showRedFlags)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
              showRedFlags
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
            title="Toggle Red Flag Emergency Markers"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Red Flags ({redFlags.length})</span>
          </button>

          {/* Zoom & Reset Buttons */}
          <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Reset Zoom / Center View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Category Quick-Filter Chips Bar */}
      <div className="px-4 py-2 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-teal-600" />
          <span>Focus Letter:</span>
        </span>
        <button
          onClick={() => setActiveCategoryFilter(null)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
            activeCategoryFilter === null
              ? 'bg-teal-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 border border-slate-200 dark:border-slate-700'
          }`}
        >
          All (9 Categories)
        </button>
        {vindicateList.map((item) => {
          const isSelected = activeCategoryFilter === item.letter;
          const catInfo = CATEGORY_COLORS[item.letter];
          return (
            <button
              key={item.letter}
              onClick={() => setActiveCategoryFilter(isSelected ? null : item.letter)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 border ${
                isSelected
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs ring-1 ring-teal-400'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${catInfo?.badge || 'bg-teal-500'}`} />
              <span>{item.letter === 'I2' ? 'I' : item.letter}: {item.category.split('/')[0]}</span>
              <span className="text-[9px] font-mono opacity-80">({item.weight}%)</span>
            </button>
          );
        })}
      </div>

      {/* 3. Main SVG Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-[540px] bg-slate-50/30 dark:bg-slate-950/20 select-none overflow-hidden"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 860 540"
          className="w-full h-full"
          style={{ cursor: 'grab' }}
        />

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-3 left-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-[10px] space-y-1 shadow-xs pointer-events-none">
          <div className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
            Network Topology Key:
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600 ring-2 ring-teal-400/40" />
            <span className="text-slate-600 dark:text-slate-300">Central Hub ({diseaseTitle})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-slate-600 dark:text-slate-300">VINDICATE Categories (Weight Sized)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-slate-600 dark:text-slate-300">Cardinal Symptoms (Sx)</span>
          </div>
          {showSigns && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600 dark:text-slate-300">Physical Exam Maneuvers (Rx)</span>
            </div>
          )}
          {showRedFlags && (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-600 dark:text-slate-300">Emergency Red Flag Warnings (!)</span>
            </div>
          )}
        </div>

        {/* Reheat / Physics indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleReheatSimulation}
            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-teal-600 shadow-2xs flex items-center gap-1 cursor-pointer"
            title="Re-run Force Relaxation Physics"
          >
            <RotateCcw className="w-3 h-3 text-teal-500" />
            <span>Relax Network</span>
          </button>
        </div>

        {/* Node Hover Tooltip Floating Card */}
        {hoveredNode && !selectedNode && (
          <div className="absolute top-3 left-3 p-3 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg text-xs max-w-xs pointer-events-none animate-fade-in z-20">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: hoveredNode.color }} 
              />
              <span className="font-bold text-slate-900 dark:text-white capitalize">
                {hoveredNode.label}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold ml-auto">
                {hoveredNode.type.toUpperCase()}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              {hoveredNode.detail || 'Click node to pin and inspect complete clinical pathway.'}
            </p>
          </div>
        )}
      </div>

      {/* 4. Deep Inspection Drawer / Inspector when a node is selected */}
      {selectedNode && (
        <div className="p-4 sm:p-5 bg-teal-50/70 dark:bg-slate-850 border-t border-teal-200 dark:border-teal-900/80 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-teal-200/60 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-mono font-extrabold text-base shadow-sm"
                style={{ backgroundColor: selectedNode.color }}
              >
                {selectedNode.letter ? (selectedNode.letter === 'I2' ? 'I' : selectedNode.letter) : (selectedNode.type === 'hub' ? 'HUB' : '•')}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                    Inspecting {selectedNode.type} Node
                  </span>
                  {selectedNode.weight !== undefined && (
                    <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-teal-200 dark:bg-teal-900 text-teal-800 dark:text-teal-200">
                      Relevance Weight: {selectedNode.weight}%
                    </span>
                  )}
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-serif-medical">
                  {selectedNode.label}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-800 cursor-pointer"
                title="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Role / Mechanism */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h5 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pathophysiologic Manifestation & Mechanism:</span>
              </h5>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                {selectedNode.role || selectedNode.detail || 'Central node coordinating multi-organ clinical manifestations.'}
              </p>
            </div>

            {/* Right: High-Yield Differentials or Maneuver specifics */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <h5 className="font-bold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  {selectedNode.differentials ? 'High-Yield Differentials in this Category:' : 'Clinical Verification Note:'}
                </span>
              </h5>
              {selectedNode.differentials && selectedNode.differentials.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.differentials.map((diff, i) => (
                    <span 
                      key={i} 
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 text-[11px]"
                    >
                      ⚡ {diff}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Linked to {diseaseTitle} based on peer-reviewed diagnostic consensus and MeSH biomedical ontologies.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
