/**
 * Responsive Table Wrapper Component
 * Makes any table responsive with horizontal scroll on mobile
 * and handles lengthy content gracefully
 */
const ResponsiveTable = ({ 
  children, 
  minWidth = "800px", 
  className = "",
  containerClassName = ""
}) => {
  return (
    <div className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${containerClassName}`}>
      {/* Responsive table wrapper with horizontal scroll */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div style={{ minWidth }} className="w-full">
          <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
};

/**
 * Responsive Table Cell Component
 * Handles text truncation and proper spacing
 */
export const ResponsiveCell = ({ 
  children, 
  className = "", 
  maxWidth,
  truncate = false,
  ...props 
}) => {
  const cellClasses = [
    "px-6 py-4",
    maxWidth && `max-w-[${maxWidth}]`,
    truncate && "truncate",
    className
  ].filter(Boolean).join(" ");

  return (
    <td className={cellClasses} {...props}>
      {truncate ? (
        <div className="truncate">
          {children}
        </div>
      ) : (
        children
      )}
    </td>
  );
};

/**
 * Responsive Table Header Component
 */
export const ResponsiveHeader = ({ 
  children, 
  className = "",
  minWidth,
  ...props 
}) => {
  const headerClasses = [
    "px-6 py-4 text-left text-xs font-semibold text-[#fe6019] uppercase tracking-wider",
    minWidth && `min-w-[${minWidth}]`,
    className
  ].filter(Boolean).join(" ");

  return (
    <th className={headerClasses} {...props}>
      {children}
    </th>
  );
};

/**
 * Content wrapper for table cells with icons
 */
export const CellContent = ({ 
  icon: Icon, 
  children, 
  className = "",
  iconClassName = "text-[#fe6019] flex-shrink-0"
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {Icon && <Icon size={18} className={iconClassName} />}
      <div className="min-w-0 flex-1">
        {children}
      </div>
    </div>
  );
};

export default ResponsiveTable;
