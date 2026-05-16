const TICKER_DATABASE = [
  {t:'AAPL',n:'Apple Inc',s:'Technology'},
  {t:'MSFT',n:'Microsoft Corp',s:'Technology'},
  {t:'NVDA',n:'NVIDIA Corp',s:'Technology'},
  {t:'GOOGL',n:'Alphabet Inc',s:'Technology'},
  {t:'META',n:'Meta Platforms',s:'Technology'},
  {t:'AMZN',n:'Amazon.com Inc',s:'Technology'},
  {t:'TSLA',n:'Tesla Inc',s:'Technology'},
  {t:'AMD',n:'Advanced Micro Devices',s:'Technology'},
  {t:'INTC',n:'Intel Corp',s:'Technology'},
  {t:'CRM',n:'Salesforce Inc',s:'Technology'},
  {t:'ORCL',n:'Oracle Corp',s:'Technology'},
  {t:'ADBE',n:'Adobe Inc',s:'Technology'},
  {t:'NFLX',n:'Netflix Inc',s:'Technology'},
  {t:'CSCO',n:'Cisco Systems',s:'Technology'},
  {t:'QCOM',n:'Qualcomm Inc',s:'Technology'},
  {t:'TXN',n:'Texas Instruments',s:'Technology'},
  {t:'AVGO',n:'Broadcom Inc',s:'Technology'},
  {t:'NOW',n:'ServiceNow Inc',s:'Technology'},
  {t:'SNOW',n:'Snowflake Inc',s:'Technology'},
  {t:'PLTR',n:'Palantir Technologies',s:'Technology'},
  {t:'UBER',n:'Uber Technologies',s:'Technology'},
  {t:'LYFT',n:'Lyft Inc',s:'Technology'},
  {t:'SPOT',n:'Spotify Technology',s:'Technology'},
  {t:'SHOP',n:'Shopify Inc',s:'Technology'},
  {t:'SQ',n:'Block Inc',s:'Technology'},
  {t:'PYPL',n:'PayPal Holdings',s:'Technology'},
  {t:'COIN',n:'Coinbase Global',s:'Technology'},
  {t:'RBLX',n:'Roblox Corp',s:'Technology'},
  {t:'ABNB',n:'Airbnb Inc',s:'Technology'},
  {t:'DASH',n:'DoorDash Inc',s:'Technology'},
  {t:'JPM',n:'JPMorgan Chase',s:'Finance'},
  {t:'BAC',n:'Bank of America',s:'Finance'},
  {t:'WFC',n:'Wells Fargo',s:'Finance'},
  {t:'GS',n:'Goldman Sachs',s:'Finance'},
  {t:'MS',n:'Morgan Stanley',s:'Finance'},
  {t:'C',n:'Citigroup Inc',s:'Finance'},
  {t:'AXP',n:'American Express',s:'Finance'},
  {t:'V',n:'Visa Inc',s:'Finance'},
  {t:'MA',n:'Mastercard Inc',s:'Finance'},
  {t:'BLK',n:'BlackRock Inc',s:'Finance'},
  {t:'SCHW',n:'Charles Schwab',s:'Finance'},
  {t:'COF',n:'Capital One Financial',s:'Finance'},
  {t:'USB',n:'US Bancorp',s:'Finance'},
  {t:'PNC',n:'PNC Financial Services',s:'Finance'},
  {t:'TFC',n:'Truist Financial',s:'Finance'},
  {t:'XOM',n:'ExxonMobil Corp',s:'Energy'},
  {t:'CVX',n:'Chevron Corp',s:'Energy'},
  {t:'COP',n:'ConocoPhillips',s:'Energy'},
  {t:'SLB',n:'SLB (Schlumberger)',s:'Energy'},
  {t:'EOG',n:'EOG Resources',s:'Energy'},
  {t:'OXY',n:'Occidental Petroleum',s:'Energy'},
  {t:'MPC',n:'Marathon Petroleum',s:'Energy'},
  {t:'VLO',n:'Valero Energy',s:'Energy'},
  {t:'PSX',n:'Phillips 66',s:'Energy'},
  {t:'JNJ',n:'Johnson & Johnson',s:'Healthcare'},
  {t:'UNH',n:'UnitedHealth Group',s:'Healthcare'},
  {t:'PFE',n:'Pfizer Inc',s:'Healthcare'},
  {t:'ABBV',n:'AbbVie Inc',s:'Healthcare'},
  {t:'MRK',n:'Merck & Co',s:'Healthcare'},
  {t:'TMO',n:'Thermo Fisher Scientific',s:'Healthcare'},
  {t:'ABT',n:'Abbott Laboratories',s:'Healthcare'},
  {t:'LLY',n:'Eli Lilly',s:'Healthcare'},
  {t:'BMY',n:'Bristol-Myers Squibb',s:'Healthcare'},
  {t:'GILD',n:'Gilead Sciences',s:'Healthcare'},
  {t:'AMGN',n:'Amgen Inc',s:'Healthcare'},
  {t:'MRNA',n:'Moderna Inc',s:'Healthcare'},
  {t:'ISRG',n:'Intuitive Surgical',s:'Healthcare'},
  {t:'CVS',n:'CVS Health Corp',s:'Healthcare'},
  {t:'WMT',n:'Walmart Inc',s:'Consumer'},
  {t:'HD',n:'Home Depot',s:'Consumer'},
  {t:'MCD',n:"McDonald's Corp",s:'Consumer'},
  {t:'SBUX',n:'Starbucks Corp',s:'Consumer'},
  {t:'NKE',n:'Nike Inc',s:'Consumer'},
  {t:'TGT',n:'Target Corp',s:'Consumer'},
  {t:'COST',n:'Costco Wholesale',s:'Consumer'},
  {t:'LOW',n:"Lowe's Companies",s:'Consumer'},
  {t:'TJX',n:'TJX Companies',s:'Consumer'},
  {t:'LULU',n:'Lululemon Athletica',s:'Consumer'},
  {t:'CMG',n:'Chipotle Mexican Grill',s:'Consumer'},
  {t:'BA',n:'Boeing Co',s:'Industrial'},
  {t:'CAT',n:'Caterpillar Inc',s:'Industrial'},
  {t:'GE',n:'GE Aerospace',s:'Industrial'},
  {t:'HON',n:'Honeywell International',s:'Industrial'},
  {t:'MMM',n:'3M Company',s:'Industrial'},
  {t:'UPS',n:'United Parcel Service',s:'Industrial'},
  {t:'FDX',n:'FedEx Corp',s:'Industrial'},
  {t:'LMT',n:'Lockheed Martin',s:'Industrial'},
  {t:'RTX',n:'RTX Corp',s:'Industrial'},
  {t:'DE',n:'Deere & Company',s:'Industrial'},
  {t:'T',n:'AT&T Inc',s:'Communications'},
  {t:'VZ',n:'Verizon Communications',s:'Communications'},
  {t:'TMUS',n:'T-Mobile US',s:'Communications'},
  {t:'DIS',n:'Walt Disney Co',s:'Communications'},
  {t:'CMCSA',n:'Comcast Corp',s:'Communications'},
  {t:'AMT',n:'American Tower Corp',s:'Real Estate'},
  {t:'PLD',n:'Prologis Inc',s:'Real Estate'},
  {t:'EQIX',n:'Equinix Inc',s:'Real Estate'},
  {t:'SPY',n:'SPDR S&P 500 ETF',s:'ETF'},
  {t:'QQQ',n:'Invesco QQQ Trust',s:'ETF'},
  {t:'IWM',n:'iShares Russell 2000',s:'ETF'},
  {t:'GLD',n:'SPDR Gold Shares',s:'ETF'},
  {t:'TLT',n:'iShares 20+ Year Treasury',s:'ETF'},
  {t:'VTI',n:'Vanguard Total Stock Market',s:'ETF'},
  {t:'VOO',n:'Vanguard S&P 500 ETF',s:'ETF'},
];

function initTickerAutocomplete(inputId, onSelect) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const parent = input.parentElement;
  const originalPosition = window.getComputedStyle(parent).position;
  if (originalPosition === 'static') parent.style.position = 'relative';

  const dropdown = document.createElement('div');
  dropdown.id = inputId + '-dropdown';
  dropdown.style.cssText = `
    position: absolute;
    top: calc(100% + 2px);
    left: 0;
    right: 0;
    background: #0f0f0f;
    border: 1px solid rgba(201,168,76,0.3);
    z-index: 9999;
    max-height: 220px;
    overflow-y: auto;
    display: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  `;
  parent.appendChild(dropdown);

  input.addEventListener('input', () => {
    const query = input.value.toUpperCase().trim();
    if (query.length < 1) { dropdown.style.display = 'none'; return; }

    const matches = TICKER_DATABASE.filter(t =>
      t.t.startsWith(query) || t.n.toUpperCase().includes(query)
    ).slice(0, 8);

    if (!matches.length) { dropdown.style.display = 'none'; return; }

    dropdown.innerHTML = matches.map(t => `
      <div class="ticker-option"
        data-ticker="${t.t}"
        data-name="${t.n}"
        data-sector="${t.s}"
        style="padding:0.7rem 1rem;cursor:pointer;border-bottom:1px solid rgba(201,168,76,0.08);display:flex;justify-content:space-between;align-items:center;">
        <div>
          <span style="font-family:'IBM Plex Mono',monospace;font-size:0.85rem;color:#C9A84C;">${t.t}</span>
          <span style="font-size:0.75rem;color:#6B6560;margin-left:0.8rem;">${t.n}</span>
        </div>
        <span style="font-size:0.6rem;color:#6B6560;">${t.s}</span>
      </div>
    `).join('');

    dropdown.querySelectorAll('.ticker-option').forEach(el => {
      el.addEventListener('mouseenter', () => el.style.background = 'rgba(201,168,76,0.05)');
      el.addEventListener('mouseleave', () => el.style.background = 'transparent');
      el.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const ticker = el.dataset.ticker;
        const name = el.dataset.name;
        const sector = el.dataset.sector;

        input.value = ticker;
        dropdown.style.display = 'none';

        // Auto-fill related fields
        const companyInput = document.getElementById('new-company');
        if (companyInput) companyInput.value = name;

        const sectorInput = document.getElementById('new-sector');
        if (sectorInput) sectorInput.value = sector;

        if (typeof onSelect === 'function') onSelect(ticker, name, sector);
      });
    });

    dropdown.style.display = 'block';
  });

  input.addEventListener('blur', () => {
    setTimeout(() => { dropdown.style.display = 'none'; }, 150);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') dropdown.style.display = 'none';
  });
}
