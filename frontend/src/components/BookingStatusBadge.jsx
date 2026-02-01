export default function BookingStatusBadge({ status }) {
  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: '0.375rem 1rem',
      borderRadius: '9999px',
      fontSize: '0.8rem',
      fontWeight: '700',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      border: '1px solid'
    };

    const styles = {
      'ACTION_PENDING': {
        ...baseStyle,
        backgroundColor: 'rgba(251, 146, 60, 0.15)',
        color: '#fb923c',
        borderColor: 'rgba(251, 146, 60, 0.3)'
      },
      'CHANGE_REQUESTED': {
        ...baseStyle,
        backgroundColor: 'rgba(239, 68, 68, 0.15)',
        color: '#f87171',
        borderColor: 'rgba(239, 68, 68, 0.3)'
      },
      'REJECTED': {
        ...baseStyle,
        backgroundColor: 'rgba(220, 38, 38, 0.15)',
        color: '#dc2626',
        borderColor: 'rgba(220, 38, 38, 0.3)'
      },
      'ADMIN1_APPROVED': {
        ...baseStyle,
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        color: '#22d3ee',
        borderColor: 'rgba(6, 182, 212, 0.3)'
      },
      'PAYMENT_REQUESTED': {
        ...baseStyle,
        backgroundColor: 'rgba(245, 158, 11, 0.15)',
        color: '#fbbf24',
        borderColor: 'rgba(245, 158, 11, 0.3)'
      },
      'PAYMENT_COMPLETED': {
        ...baseStyle,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        borderColor: 'rgba(16, 185, 129, 0.3)'
      },
      'ADMIN2_APPROVED': {
        ...baseStyle,
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        color: '#a78bfa',
        borderColor: 'rgba(139, 92, 246, 0.3)'
      },
      'ADMIN3_APPROVED': {
        ...baseStyle,
        backgroundColor: 'rgba(34, 197, 94, 0.15)',
        color: '#4ade80',
        borderColor: 'rgba(34, 197, 94, 0.3)'
      }
    };

    return styles[status] || baseStyle;
  };

  const getStatusIcon = (status) => {
    const icons = {
      'ACTION_PENDING': '⏳',
      'CHANGE_REQUESTED': '📝',
      'REJECTED': '❌',
      'ADMIN1_APPROVED': '✓',
      'PAYMENT_REQUESTED': '💳',
      'PAYMENT_COMPLETED': '✓',
      'ADMIN2_APPROVED': '✓✓',
      'ADMIN3_APPROVED': '✓✓✓'
    };
    return icons[status] || '•';
  };

  const getStatusText = (status) => {
    return status.replace(/_/g, ' ');
  };

  return (
    <span style={getStatusStyle(status)}>
      <span>{getStatusIcon(status)}</span>
      <span>{getStatusText(status)}</span>
    </span>
  );
}
