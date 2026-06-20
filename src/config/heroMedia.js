// Per-activity hero media. Videos stream from Pexels' stable per-video URL
// (free license, no key); posters are real frames that paint instantly and
// serve as the fallback if a video can't play. All clips verified on-subject.
const POSTER = (path) =>
  `https://images.pexels.com/videos/${path}?auto=compress&cs=tinysrgb&w=1280`
const VIDEO = (id) => `https://www.pexels.com/download/video/${id}/`

export const HERO_MEDIA = {
  motorcycle: {
    video: VIDEO(4594259),
    poster: POSTER('4594259/pexels-photo-4594259.jpeg'),
  },
  cessna: {
    video: VIDEO(28829996),
    poster: POSTER('28829996/airplane-airplane-wing-28829996.jpeg'),
  },
  skydiving: {
    video: VIDEO(33065319),
    poster: POSTER('33065319/pexels-photo-33065319.jpeg'),
  },
  waterski: {
    video: VIDEO(9953887),
    poster: POSTER('9953887/action-activity-adult-adventure-9953887.jpeg'),
  },
  surfing: {
    video: VIDEO(8494850),
    poster: POSTER('8494850/pexels-photo-8494850.jpeg'),
  },
  hunting: {
    video: VIDEO(5563155),
    poster: POSTER('5563155/4k-video-autumn-autumn-atmosphere-autumn-color-5563155.jpeg'),
  },
  sailing: {
    video: VIDEO(30127956),
    poster: POSTER('30127956/pexels-photo-30127956.jpeg'),
  },
  fishing: {
    video: VIDEO(20594660),
    poster: POSTER('20594660/desert-fishing-fly-fishing-green-river-20594660.jpeg'),
  },
  hiking: {
    video: VIDEO(29886401),
    poster: POSTER('29886401/alps-trek-29886401.jpeg'),
  },
  paragliding: {
    video: VIDEO(11213113),
    poster: POSTER('11213113/pexels-photo-11213113.jpeg'),
  },
  cycling: {
    video: VIDEO(5790076),
    poster: POSTER('5790076/aerial-photography-asphalt-athletes-bicycle-5790076.jpeg'),
  },
}

export function getHeroMedia(modeKey) {
  return HERO_MEDIA[modeKey] || HERO_MEDIA.motorcycle
}
