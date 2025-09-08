'use client'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

const formatYAxis = (tick: number) => {
  return tick > 1000 ? `${tick / 1000}k` : `${tick}`;
};

export default function SimulationChart ({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div className='h-96 w-full bg-secondary p-6 rounded-xl shadow-2xl animate-fadeIn'>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#238636" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#238636" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray='3 3' stroke='#30363D' />
          <XAxis dataKey='name' stroke='#8B949E' tick={{ fill: '#C9D1D9' }} />
          <YAxis stroke='#8B949E' tick={{ fill: '#C9D1D9' }} tickFormatter={formatYAxis} />
          <Tooltip
            contentStyle={{ 
              backgroundColor: '#161B22', 
              border: '1px solid #30363D', 
              borderRadius: '0.5rem',
              color: '#C9D1D9'
            }}
            labelStyle={{ color: '#C9D1D9', fontWeight: 'bold' }}
          />
          <Area
            type='monotone'
            dataKey='value'
            stroke='#238636'
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
