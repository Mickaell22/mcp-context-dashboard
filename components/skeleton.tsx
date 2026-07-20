export default function SkeletonRows({ cols, rows = 3 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <tr key={i} aria-hidden="true">
          {Array.from({ length: cols }, (_, j) => (
            <td key={j}><span className="skel" /></td>
          ))}
        </tr>
      ))}
    </>
  )
}
