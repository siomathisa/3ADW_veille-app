export default function TagBadge({ tag, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {tag}
      {onRemove && (
        <button
          onClick={() => onRemove(tag)}
          className="hover:text-red-500 leading-none ml-0.5"
        >
          ×
        </button>
      )}
    </span>
  )
}
