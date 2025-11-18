import { motion } from 'framer-motion';

export default function Loading({ fullScreen = false, message = 'Cargando...' }) {
  const containerClass = fullScreen 
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 z-50'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClass}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="spinner"></div>
        {message && (
          <p className="text-gray-600 font-medium">{message}</p>
        )}
      </motion.div>
    </div>
  );
}

export function LoadingButton({ loading, children, ...props }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Cargando...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
