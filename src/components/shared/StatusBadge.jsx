const styles = {
  Successful: { dot: 'bg-success', text: 'text-success' },
  Pending: { dot: 'bg-pending', text: 'text-pending' },
};

export default function StatusBadge({ status }) {
  const style = styles[status] ?? styles.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${style.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
