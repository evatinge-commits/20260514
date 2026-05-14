export interface GameState {
  characters: string[];
  words: string[];
}

export const GAME_DATA: GameState = {
  characters: ['宝', '舌', '巾', '净', '香', '齿', '刷', '洗', '臭', '便', '脸', '龙', '讲', '卫'],
  words: [
    '宝贝', '宝物', '宝藏', '舌头', '毛巾', '头巾', '干净', '香味', '香水', '饭香',
    '牙齿', '刷牙', '洗刷', '洗脸', '洗手', '臭味', '臭美', '口臭', '大便', '方便',
    '笑脸', '圆脸', '龙王', '接龙', '水龙头', '讲课', '讲卫生', '卫星'
  ]
};

export const COLOR_PALETTE = [
  'bg-pink-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-yellow-400',
  'bg-purple-400',
  'bg-orange-400',
  'bg-red-400',
  'bg-cyan-400'
];
