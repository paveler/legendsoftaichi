// Разделы админки: порядок здесь = порядок в меню
export const ADMIN_NAV = [
  { href: '/admin/participants', title: 'Участники', hint: 'Спортсмены, которые выступают' },
  { href: '/admin/spectators', title: 'Зрители', hint: 'Кто придёт смотреть' },
  { href: '/admin/sponsors', title: 'Спонсоры', hint: 'Партнёры фестиваля' },
] as const;
