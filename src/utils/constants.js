export const PALETTES = {
  forest:  {bg:'#1b4332',top:'#2d6a4f',accent:'#52b788',line:'#95d5b2',card:'#fff',cb:'#b7e4c7',txt:'#081c15',sub:'#2d6a4f',tag:'#d8f3dc',tagT:'#1b4332',sBg:'#2d6a4f',sTxt:'#fff'},
  ocean:   {bg:'#023e8a',top:'#0077b6',accent:'#48cae4',line:'#90e0ef',card:'#fff',cb:'#ade8f4',txt:'#03045e',sub:'#0077b6',tag:'#caf0f8',tagT:'#023e8a',sBg:'#0077b6',sTxt:'#fff'},
  sunset:  {bg:'#7f2704',top:'#bf360c',accent:'#ff7043',line:'#ffab91',card:'#fff',cb:'#ffccbc',txt:'#3e0000',sub:'#bf360c',tag:'#ffd7ba',tagT:'#7f2704',sBg:'#bf360c',sTxt:'#fff'},
  blossom: {bg:'#6d2b3d',top:'#ad1457',accent:'#f48fb1',line:'#f8bbd0',card:'#fff',cb:'#fce4ec',txt:'#4a0e2a',sub:'#ad1457',tag:'#fce4ec',tagT:'#6d2b3d',sBg:'#ad1457',sTxt:'#fff'},
  lavender:{bg:'#2c1569',top:'#4527a0',accent:'#9575cd',line:'#ce93d8',card:'#fff',cb:'#e1bee7',txt:'#12005e',sub:'#4527a0',tag:'#e8d5f5',tagT:'#2c1569',sBg:'#4527a0',sTxt:'#fff'},
  sand:    {bg:'#5c4033',top:'#795548',accent:'#ffca28',line:'#ffe082',card:'#fff',cb:'#fff8e1',txt:'#3e2723',sub:'#795548',tag:'#fff8e1',tagT:'#5c4033',sBg:'#795548',sTxt:'#fff'},
};

export const DOTS = ['#e63946','#f4a261','#2a9d8f','#457b9d','#e76f51','#6d6875','#264653','#a8dadc','#e9c46a','#9b5de5'];

export const THEMES = ['역사/문화', '자연/힐링', '맛집/미식', '도시/쇼핑', '액티비티'];

export const DEFAULT_STOPS = [
  {name:'국립경주박물관', time:'10:00', memo:'신라 유물, 입장 무료'},
  {name:'동궁과 월지', time:'12:00', memo:'야경이 아름다운 궁터'},
  {name:'첨성대', time:'13:30', memo:'삼국시대 천문 관측소'},
  {name:'황리단길', time:'15:00', memo:'전통 한옥 카페 거리'},
  {name:'월정교', time:'18:00', memo:'경주 대표 야경 명소'},
];

export function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  if (h === 0) return '오전 12:' + String(m).padStart(2, '0');
  if (h < 12) return '오전 ' + h + ':' + String(m).padStart(2, '0');
  if (h === 12) return '오후 12:' + String(m).padStart(2, '0');
  return '오후 ' + (h - 12) + ':' + String(m).padStart(2, '0');
}

export function escHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
