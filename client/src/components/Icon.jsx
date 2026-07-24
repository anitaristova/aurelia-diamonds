const paths = {
  account: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </>
  ),
  heart: (
    <path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.5-9.5 9-9.5 9z" />
  ),
  cart: (
    <>
      <path d="M6 6h15l-1.5 9h-12z" />
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M6 6 5 3H2" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  chevron: <path d="m6 9 6 6 6-6" />,
  trash: (
    <>
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M6 7l1 13h10l1-13" />
    </>
  ),
  truck: (
    <>
      <path d="M2 7h11v9H2z" />
      <path d="M13 10h5l3 3v3h-8z" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  support: (
    <>
      <path d="M4 13a8 8 0 0 1 16 0" />
      <rect x="2" y="13" width="4" height="6" rx="1" />
      <rect x="18" y="13" width="4" height="6" rx="1" />
    </>
  ),
  shield: <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6z" />,
  gift: (
    <>
      <rect x="3" y="8" width="18" height="4" />
      <path d="M5 12h14v9H5z" />
      <path d="M12 8v13" />
      <path d="M12 8S9 3 7 5s5 3 5 3zm0 0s3-5 5-3-5 3-5 3z" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
};

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.4 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
