import React, { useEffect, useRef } from "react";

const IPFS_GATEWAY = "http://127.0.0.1:8080/ipfs";

function VideoPlayer({
  currentMovie,
  isLoadingMovie,
  selectedSeason,
  selectedEpisode,
  selectedQuality,
  videoKey,
  onPlayerReady,
}) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const playerInstance = useRef(null);

  // ✅ Lấy nguồn video phù hợp cho Movie hoặc TVSeries
  const getVideoSource = () => {
    if (!currentMovie) return null;

    // --- Nếu là phim lẻ ---
    if (currentMovie.category?.toLowerCase() === "movie") {
      const sources = currentMovie.video_source?.sources || {};
      const source =
        sources[selectedQuality] || Object.values(sources)[0];

      // Chuẩn hóa về định dạng Plyr hiểu được
      if (source) {
        return {
          type: "ipfs",
          sources: {
            [selectedQuality || "default"]: source,
          },
        };
      }
      return null;
    }

    // --- Nếu là phim bộ ---
    if (
      currentMovie.category?.toLowerCase() === "tvseries" &&
      currentMovie.seasons?.[selectedSeason]?.episodes?.[selectedEpisode]
    ) {
      return currentMovie.seasons[selectedSeason].episodes[selectedEpisode].video_source;
    }

    return null;
  };

  // ✅ Cleanup Plyr khi component unmount
  useEffect(() => {
    return () => {
      if (playerInstance.current) {
        try {
          playerInstance.current.destroy();
          console.log("🧹 Destroyed Plyr instance");
        } catch (e) {
          console.warn("⚠️ Error destroying Plyr:", e);
        }
        playerInstance.current = null;
      }
    };
  }, []);

  // ✅ Khởi tạo Plyr lại mỗi khi videoKey đổi
  useEffect(() => {
    const videoEl = playerRef.current;
    const PlyrLib = window.Plyr;
    const videoSource = getVideoSource();

    if (!PlyrLib || !videoEl || !videoSource?.sources) return;

    // Hủy player cũ
    if (playerInstance.current) {
      try {
        playerInstance.current.destroy();
        playerInstance.current = null;
      } catch (err) {
        console.warn("⚠️ Destroy error:", err);
      }
    }

    // Chuẩn bị danh sách nguồn
    const sources = Object.entries(videoSource.sources)
      .map(([quality, cid]) => ({
        src: `${IPFS_GATEWAY}/${cid}`,
        type: "video/mp4",
        size: parseInt(quality.replace("p", "")) || 720, // fallback 720p
      }))
      .sort((a, b) => b.size - a.size);

    // Xóa src cũ để React không “removeChild” nhầm node
    videoEl.removeAttribute("src");
    videoEl.load();

    // ✅ Tạo Plyr instance mới
    const player = new PlyrLib(videoEl, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "pip",
        "airplay",
        "fullscreen",
      ],
      settings: ["quality", "speed", "loop"],
      quality: {
        default: parseInt(selectedQuality?.replace("p", "")) || sources[0]?.size,
        options: sources.map((s) => s.size),
        forced: true,
        onChange: (q) => onPlayerReady?.(q),
      },
    });

    player.source = { type: "video", sources };
    playerInstance.current = player;

    console.log("🎬 Plyr initialized:", currentMovie.title);

    // Cleanup riêng cho mỗi lần đổi videoKey
    return () => {
      if (playerInstance.current) {
        try {
          playerInstance.current.destroy();
          console.log("♻️ Destroyed Plyr before remount");
        } catch (e) {
          console.warn("⚠️ Cleanup Plyr failed:", e);
        } finally {
          playerInstance.current = null;
        }
      }
    };
  }, [videoKey, selectedSeason, selectedEpisode, selectedQuality, currentMovie]);

  if (isLoadingMovie) {
    return (
      <div className="section__player">
        <div className="error-message">Loading video...</div>
      </div>
    );
  }

  return (
    // 👇 Gắn key trực tiếp vào container, buộc React remount hoàn toàn mỗi video mới
    <div key={`video-container-${videoKey}`} ref={containerRef} className="section__player">
      <video
        ref={playerRef}
        playsInline
        controls
        crossOrigin="anonymous"
        poster={currentMovie.cover_image_url}
        className="plyr-video"
      />
    </div>
  );
}

export default VideoPlayer;
