import { useParams, useNavigate } from 'react-router-dom';
import BackButton from '../components/layout/BackButton';
import { primaryIncident } from '../utils/mockData';
import { Network, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * TopologyPage - Entity Topology Graph
 *
 * Visualizes the "blast radius" - shows which services
 * are healthy, degraded, or critical
 */
const TopologyPage = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const topology = primaryIncident.topology;

  const getHealthIcon = (health) => {
    switch (health) {
      case 'HEALTHY':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'DEGRADED':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'CRITICAL':
        return <AlertCircle className="w-5 h-5 text-danger" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted" />;
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'HEALTHY':
        return 'border-success bg-success/10 text-success';
      case 'DEGRADED':
        return 'border-warning bg-warning/10 text-warning';
      case 'CRITICAL':
        return 'border-danger bg-danger/10 text-danger';
      default:
        return 'border-muted bg-obsidian-700 text-muted';
    }
  };

  const currentEntity = topology.nodes.find(n => n.id === entityId) || topology.nodes[0];

  return (
    <div className="max-w-6xl mx-auto">
      <BackButton onClick={() => navigate('/investigate/INC-8472')} label="Back to Investigation" />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Network className="w-8 h-8 text-electric-cyan" />
          <span className="text-gradient">Entity Topology Graph</span>
        </h1>
        <p className="text-muted">
          Blast radius analysis showing service dependencies and health states
        </p>
      </div>

      {/* Current Entity Focus */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Focused Entity</h3>
        <div className={`p-4 rounded-lg border-2 ${getHealthColor(currentEntity.health)}`}>
          <div className="flex items-center gap-3">
            {getHealthIcon(currentEntity.health)}
            <div>
              <h4 className="font-semibold text-lg">{currentEntity.name}</h4>
              <p className="text-sm text-muted">Type: {currentEntity.type} • Status: {currentEntity.health}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Topology Visualization */}
      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Service Dependencies</h3>

        {/* Simple Graph Visualization */}
        <div className="bg-obsidian-900 p-8 rounded-lg">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Column 1: Upstream */}
            <div className="space-y-4">
              <p className="text-xs text-muted text-center mb-4">UPSTREAM</p>
              {topology.nodes
                .filter(n => topology.edges.some(e => e.target === currentEntity.id && e.source === n.id))
                .map(node => (
                  <div
                    key={node.id}
                    className={`p-3 rounded-lg border ${getHealthColor(node.health)} cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => navigate(`/topology/${node.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      {getHealthIcon(node.health)}
                      <div className="text-xs">
                        <p className="font-semibold">{node.name}</p>
                        <p className="text-muted">{node.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Column 2: Current Entity (Center) */}
            <div>
              <div className={`p-6 rounded-lg border-4 ${getHealthColor(currentEntity.health)} transform scale-110`}>
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {getHealthIcon(currentEntity.health)}
                  </div>
                  <p className="font-bold text-lg">{currentEntity.name}</p>
                  <p className="text-xs text-muted mt-1">{currentEntity.type}</p>
                  <div className="mt-3 pt-3 border-t border-obsidian-600">
                    <p className="text-xs font-semibold">{currentEntity.health}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Downstream */}
            <div className="space-y-4">
              <p className="text-xs text-muted text-center mb-4">DOWNSTREAM</p>
              {topology.nodes
                .filter(n => topology.edges.some(e => e.source === currentEntity.id && e.target === n.id))
                .map(node => (
                  <div
                    key={node.id}
                    className={`p-3 rounded-lg border ${getHealthColor(node.health)} cursor-pointer hover:scale-105 transition-transform`}
                    onClick={() => navigate(`/topology/${node.id}`)}
                  >
                    <div className="flex items-center gap-2">
                      {getHealthIcon(node.health)}
                      <div className="text-xs">
                        <p className="font-semibold">{node.name}</p>
                        <p className="text-muted">{node.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* All Entities Table */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">All Entities in Topology</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-obsidian-600">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Entity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Health</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topology.nodes.map(node => (
                <tr key={node.id} className="border-b border-obsidian-700 hover:bg-obsidian-800 transition-colors">
                  <td className="py-3 px-4 font-medium">{node.name}</td>
                  <td className="py-3 px-4 text-sm text-muted">{node.type}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getHealthIcon(node.health)}
                      <span className={`text-sm ${node.health === 'CRITICAL' ? 'text-danger' : node.health === 'DEGRADED' ? 'text-warning' : 'text-success'}`}>
                        {node.health}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => navigate(`/topology/${node.id}`)}
                      className="text-sm text-electric-cyan hover:text-electric-green transition-colors"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TopologyPage;
