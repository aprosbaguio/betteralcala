const hotlines = [
  { icon: 'bi-shield-fill', label: 'Alcala Police', number: '(075) 593-2829', tel: '+63755932829' },
  { icon: 'bi-heart-pulse-fill', label: 'Alcala RHU', number: '(075) 593-4992', tel: '+63755934992' },
  { icon: 'bi-building', label: 'Municipal Hall', number: '(075) 632-5938', tel: '+63756325938' },
  { icon: 'bi-fire', label: 'BFP Pangasinan', number: '(075) 569-5387', tel: '+63755695387' },
  { icon: 'bi-telephone-fill', label: 'Emergency', number: '911', tel: '911' },
  { icon: 'bi-megaphone-fill', label: 'ARTA / PCC', number: '8888', tel: '8888' },
];

export default function HotlineBar() {
  // Four repeats split cleanly across two identical halves (-50% CSS translate)
  // so the single-line ticker loops seamlessly on wide desktop and mobile screens.
  const passes = [0, 1, 2, 3];

  return (
    <div className="hotline-bar" role="region" aria-label="Emergency hotlines">
      <div className="container">
        <div className="hotline-inner">
          <div className="hotline-items">
            <div className="hotline-items-track">
              {passes.map((passIdx) =>
                hotlines.map((h) => {
                  const isDuplicate = passIdx > 0;
                  return (
                    <a
                      key={`${passIdx}-${h.tel}`}
                      href={`tel:${h.tel}`}
                      className="hotline-item"
                      aria-hidden={isDuplicate ? 'true' : undefined}
                      tabIndex={isDuplicate ? -1 : undefined}
                    >
                      <i className={`bi ${h.icon}`} aria-hidden="true" />
                      <span>
                        {h.label}: {h.number}
                      </span>
                    </a>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
