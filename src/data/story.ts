import type { RouteKey, StageKey } from '../systems/progress';

export type StoryChoice = {
  label: string;
  hint?: string;
  next?: string;
  route?: RouteKey;
  onlyForRoute?: RouteKey;
  stage?: StageKey;
  scene?: 'StarScene' | 'FleetScene' | 'DrumScene';
  returnNode?: string;
  ending?: string;
};

export type StoryLine = {
  speaker: string;
  text: string;
};

export type StoryNode = {
  id: string;
  lines: StoryLine[];
  choices?: StoryChoice[];
  onComplete?: {
    stage?: StageKey;
    returnMap?: boolean;
    scene?: 'StarScene' | 'FleetScene' | 'DrumScene';
    returnNode?: string;
    ending?: string;
  };
};

export const storyNodes: Record<string, StoryNode> = {
  opening: {
    id: 'opening',
    lines: [
      { speaker: '旁白', text: '三國時代，故事發生在東吳大營。你就是諸葛亮，要用觀察和冷靜解決一個大麻煩。' },
      { speaker: '周瑜', text: '諸葛先生，我軍即將與曹操決戰，但弓箭嚴重不足。' },
      { speaker: '周瑜', text: '我命令你，在三天之內，為我軍造出十萬支箭！' },
      { speaker: '旁白', text: '這是一個陷阱。三天不可能真的造出十萬支箭，但你不能慌。' },
    ],
    choices: [
      { label: '自信地答應：「三天？沒問題！」', hint: '冷靜接受挑戰', route: 'A', stage: 'rusu', next: 'route_a_intro' },
      { label: '假裝害怕：「我盡力……」', hint: '以退為進', route: 'B', stage: 'rusu', next: 'route_b_intro' },
      { label: '點頭答應，偷偷拉魯肅衣袖', hint: '立刻找盟友', route: 'C', stage: 'rusu', next: 'route_c_intro' },
    ],
  },
  route_a_intro: {
    id: 'route_a_intro',
    lines: [
      { speaker: '諸葛亮', text: '三天？完全沒有問題。我立刻去準備。' },
      { speaker: '周瑜', text: '好！你立下軍令狀，若完不成，按軍法處置！' },
      { speaker: '魯肅', text: '先生！你怎麼就答應了？三天真的能造十萬支箭嗎？' },
      { speaker: '諸葛亮', text: '魯肅，我需要你幫我一個忙。到江岸來找我。' },
    ],
    onComplete: { stage: 'rusu', returnMap: true },
  },
  route_b_intro: {
    id: 'route_b_intro',
    lines: [
      { speaker: '諸葛亮', text: '三天……好、好吧，我盡力。' },
      { speaker: '旁白', text: '你走出大帳，立刻恢復平靜。這時，周瑜的副將來打探計劃。' },
      { speaker: '副將', text: '諸葛先生，都督問你，打算用什麼方法造箭？' },
    ],
    choices: [
      { label: '告訴他：用草船去曹營借箭', hint: '計劃洩露', ending: 'bad2' },
      { label: '微笑說：還在想，想好了再告訴都督', hint: '保守秘密', stage: 'rusu', next: 'route_b_safe' },
    ],
  },
  route_b_safe: {
    id: 'route_b_safe',
    lines: [
      { speaker: '諸葛亮', text: '對付想害你的人，不能把計劃說得太早。' },
      { speaker: '旁白', text: '你避開打探，決定去找最值得信任的魯肅。' },
    ],
    onComplete: { stage: 'rusu', returnMap: true },
  },
  route_c_intro: {
    id: 'route_c_intro',
    lines: [
      { speaker: '諸葛亮', text: '魯肅，你是我在東吳唯一信任的人。我需要你的幫忙。' },
      { speaker: '魯肅', text: '你說！我一定幫！' },
      { speaker: '諸葛亮', text: '到江岸準備船和草人。三天後，我要去曹操那裏借箭。' },
    ],
    onComplete: { stage: 'rusu', returnMap: true },
  },
  rusu_plan: {
    id: 'rusu_plan',
    lines: [
      { speaker: '魯肅', text: '先生，你到底需要我準備什麼？' },
      { speaker: '旁白', text: '草船借箭的重點不是造箭，而是讓敵人的箭落到草人身上。' },
    ],
    choices: [
      { label: '準備二十艘船、草人和青布', hint: '正確道具', stage: 'star', scene: 'StarScene', returnNode: 'after_star' },
      { label: '準備大量木材和工匠，真的造箭', hint: '方向錯誤', ending: 'bad1' },
    ],
  },
  after_star: {
    id: 'after_star',
    lines: [
      { speaker: '魯肅', text: '先生！江面起霧了！我們現在出發嗎？' },
      { speaker: '諸葛亮', text: '霧有濃淡，時機比速度更重要。' },
    ],
    choices: [
      { label: '有霧就走！趁早出發！', hint: '霧還太薄', ending: 'bad4' },
      { label: '再等等，等霧更濃才出發', hint: '等待最佳時機', stage: 'fleet', scene: 'FleetScene', returnNode: 'after_fleet' },
    ],
  },
  after_fleet: {
    id: 'after_fleet',
    lines: [
      { speaker: '曹操', text: '霧中有船靠近，看不清虛實。不可輕出！' },
      { speaker: '曹操', text: '傳令弓弩手，隔霧放箭！' },
      { speaker: '魯肅', text: '先生，箭如暴雨！我們要穩住船隊！' },
    ],
    onComplete: { stage: 'drum', scene: 'DrumScene', returnNode: 'after_drum' },
  },
  after_drum: {
    id: 'after_drum',
    lines: [
      { speaker: '魯肅', text: '滿船都是箭！現在該怎麼回去？' },
      { speaker: '旁白', text: '不同路線，最後的危機也不同。冷靜判斷，才能把箭帶回東吳。' },
    ],
    choices: [
      { label: '調轉船頭，趁霧返航', hint: '完成自信路線', onlyForRoute: 'A', ending: 'happyA' },
      { label: '命令士兵迎上巡邏船戰鬥', hint: '草船沒有戰鬥力', onlyForRoute: 'B', ending: 'bad5' },
      { label: '不理巡邏船，全速前進', hint: '利用大霧脫身', onlyForRoute: 'B', ending: 'happyB' },
      { label: '用槳硬抗大風', hint: '人力對抗自然', onlyForRoute: 'C', ending: 'bad6' },
      { label: '掉轉船頭，順風回去', hint: '順勢而為', onlyForRoute: 'C', ending: 'happyC' },
    ],
  },
};

export const endings: Record<string, StoryLine[]> = {
  bad1: [
    { speaker: 'Bad Ending 1', text: '你真的開始造箭，但三天只造出三千支。草船借箭的關鍵不是造箭，而是向敵人借箭。' },
  ],
  bad2: [
    { speaker: 'Bad Ending 2', text: '計劃被周瑜知道，他派船阻止你出發。做事要謹慎，不是所有人都值得信任。' },
  ],
  bad4: [
    { speaker: 'Bad Ending 4', text: '霧太薄，曹軍看穿草人是假兵。等待，也是一種智慧。' },
  ],
  bad5: [
    { speaker: 'Bad Ending 5', text: '草船被當成戰船硬闖，結果被巡邏船包圍。要用自己的長處，避開弱點。' },
  ],
  bad6: [
    { speaker: 'Bad Ending 6', text: '士兵硬划對抗大風，草船反而撞向曹營。聰明人不對抗自然，而是利用自然。' },
  ],
  badFogQuiz: [
    { speaker: 'Bad Ending', text: '你判斷錯了天象。草船借箭需要雲多、夜晚和濃霧，否則曹軍會看穿計策。' },
  ],
  badDrum: [
    { speaker: 'Bad Ending', text: '鼓聲斷斷續續，曹軍起了疑心，停止放箭。節奏不穩，草船就借不到足夠的箭。' },
  ],
  happyA: [
    { speaker: 'Happy Ending', text: '你靠準備、耐心與勇氣借得十萬支箭。周瑜長嘆：諸葛亮的才智，我真的比不上。' },
  ],
  happyB: [
    { speaker: 'Happy Ending', text: '你保守秘密，信任盟友，遇險不慌。草船滿載而歸，周瑜只能心服口服。' },
  ],
  happyC: [
    { speaker: 'Happy Ending', text: '你順勢借風，讓草船飛快返航。風、霧、草人，全都成了你的助力。' },
  ],
};
