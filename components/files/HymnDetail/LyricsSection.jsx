// components/hymnDetail/LyricsSection.jsx

export default function LyricsSection({ lyrics }) {
  const formatLyrics = (lyrics) => {
    if (!lyrics) return [];
    return lyrics.split("\n\n").map((verse, index) => ({
      number: index + 1,
      text: verse,
    }));
  };

  const verses = formatLyrics(lyrics);

  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-serif font-semibold mb-4 sm:mb-6 flex items-center text-indigo-800">
        <BookOpen size={20} className="mr-2" />
        Lyrics
      </h2>
      <div className="space-y-6 sm:space-y-8">
        {verses.map((verse, index) => (
          <div key={index} className="space-y-1 sm:space-y-2">
            <h3 className="font-semibold text-indigo-600">
              Verse {verse.number}
            </h3>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
              {verse.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
