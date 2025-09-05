import React, { useState } from 'react'
import { BookOpen, ExternalLink, Star, Clock, Filter } from 'lucide-react'
import { mockData } from '../data/mockData'

const LearnView = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  
  const { learningContent, categories } = mockData.learning

  const filteredContent = learningContent.filter(content => {
    const categoryMatch = selectedCategory === 'all' || content.category === selectedCategory
    const difficultyMatch = selectedDifficulty === 'all' || content.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-500 bg-green-500/10'
      case 'Intermediate': return 'text-yellow-500 bg-yellow-500/10'
      case 'Advanced': return 'text-red-500 bg-red-500/10'
      default: return 'text-text-secondary bg-surface'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Article': return BookOpen
      case 'Course': return Star
      default: return BookOpen
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Learning Pathways</h1>
        <p className="text-text-secondary">
          Curated content to help you optimize your creator earnings based on your performance data
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Filters:</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-text-secondary">Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-sm text-text-secondary">Difficulty</label>
              <select 
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary"
              >
                <option value="all">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended for You */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {filteredContent.slice(0, 2).map((content) => {
            const Icon = getTypeIcon(content.type)
            return (
              <div key={content.id} className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-md flex items-center justify-center">
                    <Icon size={20} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-text-primary">{content.title}</h3>
                      <ExternalLink size={16} className="text-text-secondary hover:text-text-primary cursor-pointer" />
                    </div>
                    <p className="text-sm text-text-secondary mb-3 line-clamp-2">{content.description}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className={`px-2 py-1 rounded-full ${getDifficultyColor(content.difficulty)}`}>
                        {content.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Clock size={12} />
                        {content.readTime}
                      </div>
                      <span className="text-text-secondary">{content.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* All Content */}
      <div>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          All Learning Content ({filteredContent.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContent.map((content) => {
            const Icon = getTypeIcon(content.type)
            return (
              <div key={content.id} className="card hover:bg-surface/80 transition-colors group cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-md flex items-center justify-center">
                    <Icon size={20} className="text-accent" />
                  </div>
                  <ExternalLink size={16} className="text-text-secondary group-hover:text-text-primary transition-colors" />
                </div>
                
                <h3 className="font-semibold text-text-primary mb-2">{content.title}</h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-3">{content.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(content.difficulty)}`}>
                      {content.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Clock size={12} />
                    {content.readTime}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-text-secondary">{content.category}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Learning Stats */}
      <div className="card">
        <h3 className="font-semibold text-text-primary mb-4">Your Learning Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-1">12</div>
            <div className="text-sm text-text-secondary">Articles Read</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent mb-1">3</div>
            <div className="text-sm text-text-secondary">Courses Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">8h</div>
            <div className="text-sm text-text-secondary">Time Invested</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearnView