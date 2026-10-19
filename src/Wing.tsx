// Kanat markası — beyaz tüy/kanat, indigo yuvarlak zeminde. İkonla birebir aynı.
export default function Wing({ size = 32, radius = 9 }: { size?: number; radius?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" aria-label="Kanat">
      <defs>
        <linearGradient id="kanatbg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx={radius * (1024 / size)} fill="url(#kanatbg)" />
      <g fill="#FFFFFF" transform="translate(6,-24)">
        <path d="M296 712 C 360 536, 470 430, 712 356 C 560 470, 492 560, 472 684 C 420 648, 356 666, 296 712 Z" />
        <path d="M300 716 C 352 580, 436 492, 612 430 C 492 520, 440 596, 428 700 C 388 676, 344 686, 300 716 Z" opacity="0.9" />
        <path d="M308 720 C 348 616, 410 548, 528 504 C 444 572, 404 632, 396 708 C 366 692, 336 700, 308 720 Z" opacity="0.8" />
      </g>
    </svg>
  )
}
