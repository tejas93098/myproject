import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import {
  BarChart3,
  LineChart as LineChartIcon,
  TrendingUp,
  Download,
  Filter,
  Users,
  BookOpen,
  Award,
  Target,
  RefreshCw,
  ChevronDown,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';

interface PerformanceData {
  id: number;
  student_id: number;
  student_name: string;
  subject: string;
  score: number;
  grade: string;
  exam_type: string;
  date: string;
  student_grade?: string;
}

interface ChartData {
  subject: string;
  averageScore: number;
  totalStudents: number;
  grade: string;
}

interface TrendData {
  date: string;
  averageScore: number;
  examCount: number;
}

interface PerformanceDashboardProps {
  performance: PerformanceData[];
  loading: boolean;
  onExportCSV: (data: any[], filename: string) => void;
  onRefresh: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  performance,
  loading,
  onExportCSV,
  onRefresh
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [chartLoading, setChartLoading] = useState(false);

  // Get unique classes and subjects
  const classes = [...new Set(performance.map(p => p.student_grade).filter(Boolean))].sort();
  const subjects = [...new Set(performance.map(p => p.subject))].sort();

  // Filter data based on selections
  const filteredData = performance.filter(item => {
    const classMatch = selectedClass === 'all' || item.student_grade === selectedClass;
    const subjectMatch = selectedSubject === 'all' || item.subject === selectedSubject;
    return classMatch && subjectMatch;
  });

  // Calculate chart data for bar chart (subject-wise averages)
  const getSubjectAverages = (): ChartData[] => {
    const subjectGroups = filteredData.reduce((acc, item) => {
      if (!acc[item.subject]) {
        acc[item.subject] = {
          scores: [],
          students: new Set(),
          grades: []
        };
      }
      acc[item.subject].scores.push(item.score);
      acc[item.subject].students.add(item.student_id);
      acc[item.subject].grades.push(item.grade);
      return acc;
    }, {} as any);

    return Object.entries(subjectGroups).map(([subject, data]: [string, any]) => ({
      subject: subject.length > 12 ? subject.substring(0, 12) + '...' : subject,
      averageScore: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length),
      totalStudents: data.students.size,
      grade: selectedClass === 'all' ? 'All' : `Class ${selectedClass}`
    }));
  };

  // Calculate trend data for line chart (performance over time)
  const getTrendData = (): TrendData[] => {
    const dateGroups = filteredData.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = {
          scores: [],
          count: 0
        };
      }
      acc[date].scores.push(item.score);
      acc[date].count++;
      return acc;
    }, {} as any);

    return Object.entries(dateGroups)
      .map(([date, data]: [string, any]) => ({
        date,
        averageScore: Math.round(data.scores.reduce((sum: number, score: number) => sum + score, 0) / data.scores.length),
        examCount: data.count
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-10); // Last 10 data points
  };

  // Calculate summary statistics
  const getSummaryStats = () => {
    if (filteredData.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        totalExams: 0,
        topSubject: 'N/A',
        improvementTrend: 0
      };
    }

    const uniqueStudents = new Set(filteredData.map(p => p.student_id)).size;
    const averageScore = filteredData.reduce((sum, p) => sum + p.score, 0) / filteredData.length;
    const totalExams = filteredData.length;

    // Find top performing subject
    const subjectAverages = getSubjectAverages();
    const topSubject = subjectAverages.length > 0 
      ? subjectAverages.reduce((prev, current) => 
          prev.averageScore > current.averageScore ? prev : current
        ).subject
      : 'N/A';

    // Calculate trend (last 5 vs previous 5 exams)
    const sortedByDate = [...filteredData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const recentExams = sortedByDate.slice(-5);
    const previousExams = sortedByDate.slice(-10, -5);
    
    const recentAvg = recentExams.length > 0 
      ? recentExams.reduce((sum, p) => sum + p.score, 0) / recentExams.length 
      : 0;
    const previousAvg = previousExams.length > 0 
      ? previousExams.reduce((sum, p) => sum + p.score, 0) / previousExams.length 
      : recentAvg;
    
    const improvementTrend = recentAvg - previousAvg;

    return {
      totalStudents: uniqueStudents,
      averageScore: Math.round(averageScore),
      totalExams,
      topSubject,
      improvementTrend: Math.round(improvementTrend * 10) / 10
    };
  };

  const subjectAverages = getSubjectAverages();
  const trendData = getTrendData();
  const stats = getSummaryStats();

  // Custom colors for charts
  const CHART_COLORS = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', 
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  // Handle export
  const handleExport = () => {
    onExportCSV(filteredData, `performance_analytics_${selectedClass !== 'all' ? `class_${selectedClass}` : 'all_classes'}_${Date.now()}`);
  };

  // Simulate chart loading for smooth transitions
  useEffect(() => {
    setChartLoading(true);
    const timer = setTimeout(() => setChartLoading(false), 500);
    return () => clearTimeout(timer);
  }, [selectedClass, selectedSubject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Performance Data</h3>
          <p className="text-gray-600">Analyzing academic performance metrics...</p>
        </div>
      </div>
    );
  }

  if (performance.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 text-center">
        <div className="max-w-md mx-auto">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Performance Data Available</h3>
          <p className="text-gray-600 mb-6">
            There's no academic performance data to display yet. Performance analytics will appear here once exam results are recorded.
          </p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-blue-600" />
            Performance & Exams Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            Comprehensive academic performance insights and trends
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 hover:scale-105"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
          
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Analytics Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="all">All Classes</option>
                {classes.map(cls => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-4 h-4" />
                <span>Showing {filteredData.length} records</span>
              </div>
              <div>
                {selectedClass !== 'all' ? `Class ${selectedClass}` : 'All Classes'} 
                {selectedSubject !== 'all' ? ` • ${selectedSubject}` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{stats.totalStudents}</div>
              <div className="text-sm text-blue-700">Students</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-8 h-8 text-green-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-green-900">{stats.averageScore}%</div>
              <div className="text-sm text-green-700">Avg Score</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <BookOpen className="w-8 h-8 text-purple-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-900">{stats.totalExams}</div>
              <div className="text-sm text-purple-700">Total Exams</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-8 h-8 text-orange-600" />
            <div className="text-right">
              <div className="text-lg font-bold text-orange-900">{stats.topSubject}</div>
              <div className="text-sm text-orange-700">Top Subject</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className={`w-8 h-8 ${stats.improvementTrend >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            <div className="text-right">
              <div className={`text-2xl font-bold ${stats.improvementTrend >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {stats.improvementTrend > 0 ? '+' : ''}{stats.improvementTrend}%
              </div>
              <div className="text-sm text-indigo-700">Trend</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Subject Performance */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Subject Performance Overview
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Average scores by subject {selectedClass !== 'all' && `for Class ${selectedClass}`}
              </p>
            </div>
          </div>

          {chartLoading ? (
            <div className="h-80 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : subjectAverages.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={subjectAverages}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="subject" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any, name: string) => [
                    `${value}%`, 
                    name === 'averageScore' ? 'Average Score' : name
                  ]}
                  labelFormatter={(label: string | number) => 
                    label ? `Subject: ${String(label)}` : ''
                    }

                />
                <Legend />
                <Bar 
                  dataKey="averageScore" 
                  name="Average Score"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No subject data available for the selected filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Line Chart - Performance Trends */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <LineChartIcon className="w-5 h-5 text-purple-600" />
                Performance Trends
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Academic performance over time (last 10 exam dates)
              </p>
            </div>
          </div>

          {chartLoading ? (
            <div className="h-80 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-purple-600 animate-spin" />
            </div>
          ) : trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  fontSize={12}
                  tickMargin={8}
                  tickFormatter={(value: string | number) => {
                    const d = new Date(value);
                    return isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }}

                />
                <YAxis 
                  stroke="#6B7280"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any, name: string) => [
                    name === 'averageScore' ? `${value}%` : value,
                    name === 'averageScore' ? 'Average Score' : 'Exam Count'
                  ]}
                  labelFormatter={(label: string | number) => {
                    const d = new Date(label);
                    return isNaN(d.getTime()) ? String(label) : `Date: ${d.toLocaleDateString()}`;
                    }}

                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#8B5CF6' }}
                  name="Average Score"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <LineChartIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No trend data available for the selected filters</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Performance Table */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Performance Records</h3>
              <p className="text-sm text-gray-600 mt-1">Latest academic performance entries</p>
            </div>
            <div className="text-sm text-gray-500">
              Showing {Math.min(filteredData.length, 10)} of {filteredData.length} records
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200">
              {filteredData.slice(0, 10).map((record) => (
                <tr key={record.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {record.student_name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{record.student_name}</div>
                        <div className="text-sm text-gray-500">Class {record.student_grade}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{record.score}%</span>
                      <div className={`ml-2 w-16 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                        <div 
                          className={`h-full transition-all duration-500 ${
                            record.score >= 90 ? 'bg-green-500' :
                            record.score >= 80 ? 'bg-blue-500' :
                            record.score >= 70 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${record.score}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      record.grade.startsWith('A') ? 'bg-green-100 text-green-800' :
                      record.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' :
                      record.grade.startsWith('C') ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {record.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.exam_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No performance records match the selected filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;