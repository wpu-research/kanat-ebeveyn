// Büyük, animasyonlu kanat — tüyler tek tek açılır.
export default function WingArt({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" className={className} aria-hidden>
      <defs>
        <linearGradient id="wingart" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="0.6" stopColor="#a5b4fc" stopOpacity="0.75" />
          <stop offset="1" stopColor="#e0e7ff" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <g fill="url(#wingart)">
        <path
          className="feather"
          style={{ animationDelay: '500ms' }}
          d="M308 720 C 348 616, 410 548, 528 504 C 444 572, 404 632, 396 708 C 366 692, 336 700, 308 720 Z"
        />
        <path
          className="feather"
          style={{ animationDelay: '300ms' }}
          d="M300 716 C 352 580, 436 492, 612 430 C 492 520, 440 596, 428 700 C 388 676, 344 686, 300 716 Z"
        />
        <path
          className="feather"
          style={{ animationDelay: '100ms' }}
          d="M296 712 C 360 536, 470 430, 712 356 C 560 470, 492 560, 472 684 C 420 648, 356 666, 296 712 Z"
        />
      </g>
    </svg>
  )
}
