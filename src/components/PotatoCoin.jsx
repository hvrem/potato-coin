import React, { useState, useEffect } from 'react';
import { 
  Trophy,
  Sprout,
  Twitter,
  Copy,
  ExternalLink,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/PotatoCoin.css';

const CONTRACT_ADDRESS = "5rnsq6uu1UWQ3Z3AuUcJFoN1sngSv4zipURQJijg7NyB"; // Replace with actual address

const PotatoGarden = () => {
  const [plantedPotatoes, setPlantedPotatoes] = useState([]);
  const [totalPlanted, setTotalPlanted] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [achievementUnlocked, setAchievementUnlocked] = useState(null);

  const connectWallet = async () => {
    try {
      const { solana } = window;

      if (!solana?.isPhantom) {
        alert('Please install Phantom Wallet!');
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await solana.connect();
      setWalletAddress(response.publicKey.toString());
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = () => {
    window.solana?.disconnect();
    setWalletAddress(null);
    setWalletConnected(false);
  };

  // Achievements array
  const achievements = [
    { id: 1, threshold: 100, reward: "Early Farmer NFT", icon: "🌱" },
    { id: 2, threshold: 500, reward: "Potato Master Role", icon: "👨‍🌾" },
    { id: 3, threshold: 1000, reward: "100 $SPUD Tokens", icon: "🪙" },
    { id: 4, threshold: 5000, reward: "Rare Garden Plot NFT", icon: "🏡" },
    { id: 5, threshold: 10000, reward: "Guaranteed Airdrop!", icon: "🪂" },
  ];

  // Dynamic leaderboard with periodic updates
  const [leaderboard, setLeaderboard] = useState([
    { name: "🥇 PotatoKing", potatoes: 13337, isActive: true },
    { name: "🥈 SpudMaster", potatoes: 9562, isActive: false },
    { name: "🥉 TaterFarmer", potatoes: 8548, isActive: true },
    { name: "GardenPro", potatoes: 7315, isActive: true },
    { name: "PotatoLord", potatoes: 6892, isActive: false },
    { name: "SpudLife", potatoes: 5427, isActive: true },
    { name: "FarmKing", potatoes: 4991, isActive: true },
    { name: "PotatoChef", potatoes: 4445, isActive: false },
    { name: "GardenGuru", potatoes: 3998, isActive: true },
    { name: "You", potatoes: totalPlanted }
  ]);

  // Update leaderboard when total changes
  useEffect(() => {
    setLeaderboard(prev => {
      const updatedBoard = prev.map(player => 
        player.name === "You" ? {...player, potatoes: totalPlanted} : player
      ).sort((a, b) => b.potatoes - a.potatoes);
      return updatedBoard;
    });
  }, [totalPlanted]);

  const copyAddress = () => {
    navigator.clipboard.writeText(CONTRACT_ADDRESS);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const checkAchievements = (total) => {
    const newAchievement = achievements.find(a => a.threshold === total);
    if (newAchievement) {
      setAchievementUnlocked(newAchievement);
      setTimeout(() => setAchievementUnlocked(null), 5000);
    }
  };

  const plantPotato = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newPotato = {
      id: Date.now(),
      x,
      y,
      rotation: Math.random() * 360,
      size: 0
    };

    setPlantedPotatoes([...plantedPotatoes, newPotato]);
    const newTotal = totalPlanted + 1;
    setTotalPlanted(newTotal);
    checkAchievements(newTotal);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav className="nav-bar">
        <div className="nav-content">
          <div className="contract-info">
            <span className="label">CA:</span>
            <span className="address">{CONTRACT_ADDRESS}</span>
            <button className="copy-btn" onClick={copyAddress}>
              <Copy size={16} />
              {showCopied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="nav-links">
            {!walletConnected ? (
              <button className="wallet-btn" onClick={connectWallet}>
                <img 
                  src="/phantom.svg" 
                  alt="Phantom" 
                  className="wallet-icon"
                />
                Connect Phantom
              </button>
            ) : (
              <button className="wallet-btn connected" onClick={disconnectWallet}>
                <img 
                  src="/phantom.svg" 
                  alt="Phantom" 
                  className="wallet-icon"
                />
                {walletAddress?.slice(0, 4)}...{walletAddress?.slice(-4)}
              </button>
            )}
            <a href="https://dexscreener.com/YOURLINK" target="_blank" rel="noopener noreferrer" className="dex-link">
              <ExternalLink size={16} />
              Dexscreener
            </a>
            <a href="https://twitter.com/YOURHANDLE" target="_blank" rel="noopener noreferrer" className="twitter-link">
              <Twitter size={16} />
              Twitter
            </a>
          </div>
        </div>
      </nav>

      <header className="garden-header">
        <h1>🥔 Potato Garden 🌱</h1>
        <p>Click anywhere to plant potatoes!</p>
        <div className="total-counter">
          <Sprout size={24} />
          <span>Your Total Planted: {totalPlanted}</span>
        </div>
      </header>

      <div className="garden-layout">
        <motion.div 
          className="garden-plot"
          onClick={plantPotato}
        >
          <div className="soil-texture"></div>
          
          <AnimatePresence>
            {plantedPotatoes.map((potato) => (
              <motion.div
                key={potato.id}
                className="potato-plant"
                initial={{ 
                  scale: 0,
                  x: potato.x - 20,
                  y: potato.y - 20,
                  rotate: potato.rotation
                }}
                animate={[
                  { scale: [0, 1.2, 1], transition: { duration: 0.3 } },
                  { 
                    y: potato.y - 30,
                    transition: { 
                      delay: 0.3,
                      duration: 0.5,
                      ease: "easeOut"
                    }
                  }
                ]}
                exit={{ scale: 0 }}
              >
                <motion.div 
                  className="potato"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [potato.rotation, potato.rotation + 5, potato.rotation]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="potato-spots"></div>
                </motion.div>
                <motion.div 
                  className="leaves"
                  animate={{
                    rotateZ: [0, 5, -5, 0],
                    y: [0, -2, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Sprout size={24} color="#2d5a27" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="right-panel">
          {/* Achievements Section */}
          <div className="achievements-panel">
            <div className="achievements-header">
              <Star size={24} />
              <h2>Achievements</h2>
            </div>
            <div className="achievements-list">
              {achievements.map(achievement => (
                <div 
                  key={achievement.id} 
                  className={`achievement-item ${totalPlanted >= achievement.threshold ? 'achieved' : ''}`}
                >
                  <div className="achievement-icon">{achievement.icon}</div>
                  <div className="achievement-info">
                    <div className="achievement-title">
                      {achievement.threshold.toLocaleString()} Potatoes
                    </div>
                    <div className="achievement-reward">
                      Reward: {achievement.reward}
                    </div>
                  </div>
                  <div className="achievement-progress">
                    {Math.min(100, (totalPlanted / achievement.threshold * 100).toFixed(1))}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="leaderboard">
            <div className="leaderboard-header">
              <Trophy size={24} />
              <h2>Top Potato Farmers</h2>
            </div>
            
            <div className="leaderboard-list">
              {leaderboard.map((player, index) => (
                <motion.div 
                  key={player.name}
                  className={`leaderboard-item ${player.name === "You" ? "you" : ""} ${player.isActive ? "active" : ""}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <span className="player-name">{player.name}</span>
                  <span className="player-score">
                    {player.potatoes.toLocaleString()} 🥔
                    {player.isActive && <span className="live-indicator">LIVE</span>}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Popup */}
      <AnimatePresence>
        {achievementUnlocked && (
          <motion.div 
            className="achievement-popup"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="achievement-popup-icon">{achievementUnlocked.icon}</div>
            <div className="achievement-popup-content">
              <h3>Achievement Unlocked!</h3>
              <p>{achievementUnlocked.reward}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PotatoGarden;