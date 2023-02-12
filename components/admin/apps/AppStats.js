export default function AppStats({ stats }) {
  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900">Application Analytics</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-4 md:grid-cols-2">
        {stats.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-lg bg-white px-4 py-5 border-2 border-gray-100 sm:p-6">
            <dt className="truncate text-sm font-medium text-gray-500">{item.name}</dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{item.stat}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}