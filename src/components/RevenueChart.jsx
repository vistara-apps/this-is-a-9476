import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const RevenueChart = ({ data }) => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 20%)" />
          <XAxis 
            dataKey="month" 
            stroke="hsl(220 15% 65%)"
            fontSize={12}
          />
          <YAxis 
            stroke="hsl(220 15% 65%)"
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(220 20% 12%)',
              border: '1px solid hsl(220 20% 20%)',
              borderRadius: '8px',
              color: 'hsl(220 15% 95%)'
            }}
            formatter={(value) => [`$${value}`, 'Revenue']}
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(210 70% 50%)" 
            strokeWidth={3}
            dot={{ fill: 'hsl(210 70% 50%)', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: 'hsl(210 70% 50%)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RevenueChart