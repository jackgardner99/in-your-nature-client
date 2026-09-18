function Logo({ leaf = '#7FA39C', stem = '#2C2438', size }) {
  return (
    <svg
      className="mark"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
      style={size ? { width: size, height: size } : undefined}
    >
      <circle cx="20" cy="20" r="18.5" stroke="#2F6E68" strokeWidth="1.4" />
      <path
        d="M20 31c0-6-2.6-8.5-6.4-10.2C17 20 20 21.4 20 25.6"
        stroke={leaf}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M20 31c0-7.5 2.6-10 6.6-11.8C23 19 20 20.6 20 25"
        stroke={stem}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M20 31V16" stroke={stem} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="20" cy="12.4" r="3.1" fill="#C9713D" />
    </svg>
  )
}

export default Logo
