// MyRPGLife 3 - Lunalis - Système de gamification avancé
class MyRPGLife {
    constructor() {
        this.data = this.loadData();
        this.timer = {
            isRunning: false,
            isPaused: false,
            currentTime: 0,
            totalTime: 25 * 60, // 25 minutes par défaut
            interval: null,
            type: 'focus', // 'focus' ou 'break'
            breakCount: 0,
            totalBreaks: 0,
            sessionStartTime: null,
            xpEarned: 0
        };
        
        this.ranks = [
            { name: 'Paumé', title: 'Novice', badge: 'E', minXP: 0, color: '#666666', avatar: '🎯' },
            { name: 'Apprenti', title: 'Débutant', badge: 'D', minXP: 100, color: '#8b4513', avatar: '⚡' },
            { name: 'Disciple', title: 'Étudiant', badge: 'C', minXP: 300, color: '#4169e1', avatar: '🔥' },
            { name: 'Adepte', title: 'Pratiquant', badge: 'B', minXP: 600, color: '#32cd32', avatar: '💎' },
            { name: 'Expert', title: 'Maître', badge: 'A', minXP: 1000, color: '#ffd700', avatar: '👑' },
            { name: 'Virtuose', title: 'Grand Maître', badge: 'S', minXP: 1500, color: '#ff6347', avatar: '🌟' },
            { name: 'Légende', title: 'Sage', badge: 'SS', minXP: 2200, color: '#9932cc', avatar: '🔮' },
            { name: 'Élu du Destin', title: 'Transcendant', badge: 'SSS', minXP: 3000, color: '#00ffff', avatar: '🌙' }
        ];
        
        this.achievements = [
            // Faciles
            { id: 'first_focus', name: 'Premiers Pas', description: 'Première session de focus', xp: 5, difficulty: 'facile', unlocked: false },
            { id: 'early_bird', name: 'Lève-tôt', description: 'Session avant 7h du matin', xp: 10, difficulty: 'facile', unlocked: false },
            { id: 'daily_goal', name: 'Objectif Quotidien', description: 'Atteindre 15 XP en une journée', xp: 15, difficulty: 'facile', unlocked: false },
            
            // Moyens
            { id: 'focus_hunter', name: 'Chasseur de Focus', description: '10 sessions de focus', xp: 25, difficulty: 'moyen', unlocked: false },
            { id: 'weekly_warrior', name: 'Guerrier Hebdomadaire', description: '7 jours consécutifs à 15+ XP', xp: 50, difficulty: 'moyen', unlocked: false },
            { id: 'sport_master', name: 'Maître du Sport', description: '7 jours consécutifs de sport', xp: 30, difficulty: 'moyen', unlocked: false },
            
            // Premium
            { id: 'focus_master', name: 'Maître du Focus', description: '50 sessions de focus', xp: 100, difficulty: 'premium', unlocked: false },
            { id: 'xp_collector', name: 'Collectionneur XP', description: 'Atteindre 1000 XP total', xp: 150, difficulty: 'premium', unlocked: false },
            { id: 'marathon_runner', name: 'Marathonien', description: '4h de focus en une journée', xp: 200, difficulty: 'premium', unlocked: false },
            
            // Prestigieux
            { id: 'legend', name: 'Légende Vivante', description: '100 sessions de focus', xp: 300, difficulty: 'prestigieux', unlocked: false },
            { id: 'season_champion', name: 'Champion de Saison', description: 'Terminer une saison avec rang S+', xp: 500, difficulty: 'prestigieux', unlocked: false },
            
            // Précieux
            { id: 'transcendent', name: 'Transcendant', description: 'Atteindre le rang SSS', xp: 1000, difficulty: 'précieux', unlocked: false },
            { id: 'eternal', name: 'Éternel', description: '365 jours de streak', xp: 2000, difficulty: 'précieux', unlocked: false }
        ];
        
        this.quests = [
            { id: 'focus_marathon', name: 'Marathon Focus', description: 'Faire 4h de focus en une journée', xp: 20, active: false },
            { id: 'perfect_week', name: 'Semaine Parfaite', description: 'Atteindre 20+ XP pendant 7 jours', xp: 50, active: false },
            { id: 'early_bird_quest', name: 'Lève-tôt', description: 'Commencer une session avant 7h', xp: 15, active: false }
        ];
        
        this.intensityLevels = [
            { min: 0, max: 20, label: 'Errant du Néant', color: '#666666' },
            { min: 21, max: 40, label: 'Apprenti Perdu', color: '#8b4513' },
            { min: 41, max: 60, label: 'Disciple Motivé', color: '#4169e1' },
            { min: 61, max: 75, label: 'Adepte Déterminé', color: '#32cd32' },
            { min: 76, max: 85, label: 'Expert Focalisé', color: '#ffd700' },
            { min: 86, max: 95, label: 'Maître Discipliné', color: '#ff6347' },
            { min: 96, max: 99, label: 'Légende Vivante', color: '#9932cc' },
            { min: 100, max: 100, label: 'Transcendant', color: '#00ffff' }
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.checkDailyReset();
        this.loadAchievements();
        this.activateRandomQuests();
        
        // Mise à jour automatique toutes les secondes
        setInterval(() => {
            if (this.timer.isRunning) {
                this.updateTimer();
            }
        }, 1000);
        
        // Sauvegarde automatique toutes les 30 secondes
        setInterval(() => {
            this.saveData();
        }, 30000);
    }
    
    // Gestion des données
    loadData() {
        const defaultData = {
            totalXP: 0,
            dailyXP: 0,
            streak: 0,
            lastActiveDate: new Date().toDateString(),
            focusSessions: 0,
            totalFocusTime: 0,
            mandatorySessionsToday: 0,
            bonusSessionsUnlocked: false,
            season: 1,
            week: 1,
            weeklyScores: [],
            intensityRate: 0,
            connectedAccounts: {
                spotify: false,
                google: false
            },
            dailyActivities: {
                sport: 0,
                sleep: { hours: 0, bedTime: 'after24' },
                distractions: { instagram: 0, music: 0 }
            },
            achievements: {},
            quests: {},
            recentActivity: [],
            settings: {
                autoBreaks: true,
                spotifyIntegration: false,
                notifications: true
            }
        };
        
        const saved = localStorage.getItem('myRPGLife3_data');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }
    
    saveData() {
        localStorage.setItem('myRPGLife3_data', JSON.stringify(this.data));
    }
    
    // Gestion des événements
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.showSection(section);
            });
        });
        
        // Timer controls
        document.getElementById('startPauseBtn').addEventListener('click', () => {
            this.toggleTimer();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetTimer();
        });
        
        // Duration slider
        document.getElementById('focusDuration').addEventListener('input', (e) => {
            const minutes = parseInt(e.target.value);
            this.timer.totalTime = minutes * 60;
            this.timer.currentTime = this.timer.totalTime;
            document.getElementById('durationDisplay').textContent = `${minutes} min`;
            this.updateTimerDisplay();
            this.updateXPPreview();
        });
        
        // Fermeture des modales
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.closeModal();
            }
        });
        
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !e.target.matches('input, textarea, select')) {
                e.preventDefault();
                this.toggleTimer();
            }
            if (e.code === 'Escape') {
                this.closeModal();
            }
        });
    }
    
    // Navigation
    showSection(sectionName) {
        // Masquer toutes les sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Désactiver tous les boutons de navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Afficher la section demandée
        document.getElementById(sectionName).classList.add('active');
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Charger le contenu spécifique
        if (sectionName === 'achievements') {
            this.showAchievements();
        } else if (sectionName === 'progression') {
            this.showProgression();
        }
    }
    
    // Timer Focus
    toggleTimer() {
        if (this.timer.isRunning) {
            this.pauseTimer();
        } else {
            this.startTimer();
        }
    }
    
    startTimer() {
        if (!this.timer.sessionStartTime) {
            this.timer.sessionStartTime = new Date();
            
            // Vérifier si c'est une session matinale (avant 7h)
            const hour = new Date().getHours();
            if (hour < 7) {
                this.unlockAchievement('early_bird');
                this.activateQuest('early_bird_quest');
            }
        }
        
        this.timer.isRunning = true;
        this.timer.isPaused = false;
        
        // Mode focus : désactiver le reste de l'interface
        this.enableFocusMode();
        
        // Démarrer Spotify si activé
        if (document.getElementById('spotifyIntegration').checked && this.data.connectedAccounts.spotify) {
            this.startSpotifyPlaylist();
        }
        
        // Mettre à jour l'interface
        this.updateTimerButton();
        this.updateTimerStatus('En cours...');
        
        this.showNotification('Session focus démarrée! 🎯', 'success');
    }
    
    pauseTimer() {
        this.timer.isRunning = false;
        this.timer.isPaused = true;
        
        this.disableFocusMode();
        this.updateTimerButton();
        this.updateTimerStatus('En pause');
        
        this.showNotification('Session en pause ⏸️', 'info');
    }
    
    resetTimer() {
        this.timer.isRunning = false;
        this.timer.isPaused = false;
        this.timer.currentTime = this.timer.totalTime;
        this.timer.sessionStartTime = null;
        this.timer.xpEarned = 0;
        
        this.disableFocusMode();
        this.updateTimerDisplay();
        this.updateTimerButton();
        this.updateTimerStatus('Prêt');
        this.updateXPPreview();
        
        this.showNotification('Timer remis à zéro', 'info');
    }
    
    updateTimer() {
        if (this.timer.currentTime > 0) {
            this.timer.currentTime--;
            this.updateTimerDisplay();
            this.updateXPPreview();
            
            // Vérifier les pauses automatiques
            if (this.data.settings.autoBreaks && this.timer.currentTime > 0) {
                const elapsed = this.timer.totalTime - this.timer.currentTime;
                if (elapsed > 0 && elapsed % (25 * 60) === 0) {
                    this.startBreak();
                }
            }
        } else {
            this.completeSession();
        }
    }
    
    completeSession() {
        this.timer.isRunning = false;
        this.timer.isPaused = false;
        
        const sessionDuration = Math.floor((this.timer.totalTime) / 60); // en minutes
        const xpGained = this.calculateXP(sessionDuration);
        
        // Ajouter XP
        this.addXP(xpGained, `Session focus (${sessionDuration} min)`);
        
        // Mettre à jour les statistiques
        this.data.focusSessions++;
        this.data.totalFocusTime += sessionDuration;
        
        // Vérifier si c'est une session obligatoire ou bonus
        if (this.data.mandatorySessionsToday < 2) {
            this.data.mandatorySessionsToday++;
            if (this.data.mandatorySessionsToday === 2) {
                this.data.bonusSessionsUnlocked = true;
                this.showNotification('🎉 Sessions bonus débloquées! (+10 XP par session)', 'success');
            }
        }
        
        // Vérifier les accomplissements
        this.checkAchievements();
        
        // Réinitialiser le timer
        this.resetTimer();
        
        // Notification de fin
        this.showXPGainModal(xpGained, sessionDuration);
        
        // Mettre à jour l'interface
        this.updateUI();
        this.saveData();
    }
    
    startBreak() {
        this.pauseTimer();
        this.showNotification('Temps de pause! 5 minutes recommandées 🧘‍♂️', 'info');
        
        // Timer de pause automatique
        setTimeout(() => {
            if (confirm('Pause terminée! Reprendre la session?')) {
                this.startTimer();
            }
        }, 5 * 60 * 1000); // 5 minutes
    }
    
    calculateXP(minutes) {
        const baseXP = Math.floor(minutes / 18); // 18 min = 1 XP
        
        // Bonus pour sessions obligatoires vs bonus
        if (this.data.mandatorySessionsToday < 2) {
            return baseXP; // Sessions obligatoires : 1 XP par 18 min
        } else {
            return baseXP * 2; // Sessions bonus : 2 XP par 18 min
        }
    }
    
    updateTimerDisplay() {
        const minutes = Math.floor(this.timer.currentTime / 60);
        const seconds = this.timer.currentTime % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        document.getElementById('timerTime').textContent = timeString;
        
        // Mettre à jour le cercle de progression
        const progress = (this.timer.totalTime - this.timer.currentTime) / this.timer.totalTime;
        const circumference = 2 * Math.PI * 90; // rayon = 90
        const offset = circumference - (progress * circumference);
        
        document.getElementById('timerProgress').style.strokeDashoffset = offset;
    }
    
    updateTimerButton() {
        const btn = document.getElementById('startPauseBtn');
        const icon = btn.querySelector('i');
        const text = btn.querySelector('span');
        
        if (this.timer.isRunning) {
            icon.className = 'fas fa-pause';
            text.textContent = 'Pause';
        } else {
            icon.className = 'fas fa-play';
            text.textContent = this.timer.isPaused ? 'Reprendre' : 'Démarrer';
        }
    }
    
    updateTimerStatus(status) {
        document.getElementById('timerStatus').textContent = status;
    }
    
    updateXPPreview() {
        const sessionMinutes = Math.floor((this.timer.totalTime - this.timer.currentTime) / 60);
        const xp = this.calculateXP(sessionMinutes);
        document.getElementById('xpPreview').textContent = `+${xp} XP`;
    }
    
    enableFocusMode() {
        document.body.classList.add('focus-mode');
        document.querySelector('.timer-section').classList.remove('focus-mode');
    }
    
    disableFocusMode() {
        document.body.classList.remove('focus-mode');
    }
    
    // Système XP et Rangs
    addXP(amount, reason) {
        const oldRank = this.getCurrentRank();
        
        this.data.totalXP += amount;
        this.data.dailyXP += amount;
        
        // Ajouter à l'activité récente en formatant le signe correctement
        const formatted = amount >= 0 ? `+${amount}` : `${amount}`;
        this.addRecentActivity(`${formatted} XP`, reason);
        
        const newRank = this.getCurrentRank();
        
        // Vérifier montée de rang
        if (newRank.badge !== oldRank.badge) {
            this.showRankUpModal(oldRank, newRank);
        }
        
        this.updateUI();
    }
    
    getCurrentRank() {
        for (let i = this.ranks.length - 1; i >= 0; i--) {
            if (this.data.totalXP >= this.ranks[i].minXP) {
                return this.ranks[i];
            }
        }
        return this.ranks[0];
    }
    
    getNextRank() {
        const currentRank = this.getCurrentRank();
        const currentIndex = this.ranks.findIndex(rank => rank.badge === currentRank.badge);
        return currentIndex < this.ranks.length - 1 ? this.ranks[currentIndex + 1] : null;
    }
    
    getRankProgress() {
        const currentRank = this.getCurrentRank();
        const nextRank = this.getNextRank();
        
        if (!nextRank) {
            return { percentage: 100, current: this.data.totalXP, needed: currentRank.minXP };
        }
        
        const progress = this.data.totalXP - currentRank.minXP;
        const total = nextRank.minXP - currentRank.minXP;
        const percentage = Math.min(100, (progress / total) * 100);
        
        return {
            percentage,
            current: this.data.totalXP,
            needed: nextRank.minXP
        };
    }
    
    // Activités
    logSport() {
        const minutes = parseInt(document.getElementById('sportMinutes').value) || 0;
        if (minutes <= 0) {
            this.showNotification('Veuillez entrer un nombre de minutes valide', 'warning');
            return;
        }
        
        this.data.dailyActivities.sport += minutes;
        
        let xpGained = 0;
        if (this.data.dailyActivities.sport >= 50) {
            xpGained = 3;
            this.addXP(xpGained, `Sport (${minutes} min)`);
        }
        
        document.getElementById('sportMinutes').value = '';
        this.updateUI();
        this.saveData();
        
        this.showNotification(`Sport loggé: ${minutes} min ${xpGained > 0 ? `(+${xpGained} XP)` : ''}`, 'success');
    }
    
    logSleep() {
        const hours = parseFloat(document.getElementById('sleepHours').value) || 0;
        const bedTime = document.getElementById('bedTime').value;
        
        if (hours <= 0) {
            this.showNotification('Veuillez entrer un nombre d\'heures valide', 'warning');
            return;
        }
        
        this.data.dailyActivities.sleep = { hours, bedTime };
        
        let xpGained = 0;
        if (hours >= 7) {
            if (bedTime === 'before22') {
                xpGained = 2;
            } else if (bedTime === 'before24') {
                xpGained = 1;
            }
        } else if (hours < 8) {
            xpGained = -1;
        }
        
        if (xpGained !== 0) {
            this.addXP(xpGained, `Sommeil (${hours}h, ${this.getBedTimeLabel(bedTime)})`);
        }
        
        document.getElementById('sleepHours').value = '';
        this.updateUI();
        this.saveData();
        
        this.showNotification(`Sommeil loggé: ${hours}h ${xpGained !== 0 ? `(${xpGained > 0 ? '+' : ''}${xpGained} XP)` : ''}`, xpGained >= 0 ? 'success' : 'warning');
    }
    
    logDistractions() {
        const instaHours = parseFloat(document.getElementById('instaTime').value) || 0;
        const musicHours = parseFloat(document.getElementById('musicTime').value) || 0;
        
        if (instaHours <= 0 && musicHours <= 0) {
            this.showNotification('Veuillez entrer au moins une valeur', 'warning');
            return;
        }
        
        this.data.dailyActivities.distractions.instagram += instaHours;
        this.data.dailyActivities.distractions.music += musicHours;
        
        let xpLost = 0;
        if (instaHours >= 1) xpLost += Math.floor(instaHours) * 3;
        if (musicHours >= 1.5) xpLost += Math.floor(musicHours / 1.5) * 5;
        
        if (xpLost > 0) {
            this.addXP(-xpLost, `Distractions (Insta: ${instaHours}h, Musique: ${musicHours}h)`);
        }
        
        document.getElementById('instaTime').value = '';
        document.getElementById('musicTime').value = '';
        this.updateUI();
        this.saveData();
        
        this.showNotification(`Distractions loggées ${xpLost > 0 ? `(-${xpLost} XP)` : ''}`, 'warning');
    }
    
    getBedTimeLabel(bedTime) {
        switch (bedTime) {
            case 'before22': return 'avant 22h';
            case 'before24': return 'avant minuit';
            case 'after24': return 'après minuit';
            default: return bedTime;
        }
    }
    
    // Bilan hebdomadaire
    showWeeklyReview() {
        const modal = this.createModal('Bilan Hebdomadaire', this.getWeeklyReviewHTML());
        document.body.appendChild(modal);
        this.showModal();
    }
    
    getWeeklyReviewHTML() {
        return `
            <div class="weekly-review-form">
                <p>Évaluez votre semaine sur une échelle de 1 à 10:</p>
                <div class="review-questions">
                    <div class="question-item">
                        <label>1. Productivité générale:</label>
                        <input type="range" id="q1" min="1" max="10" value="5">
                        <span class="question-value">5</span>
                    </div>
                    <div class="question-item">
                        <label>2. Qualité du sommeil:</label>
                        <input type="range" id="q2" min="1" max="10" value="5">
                        <span class="question-value">5</span>
                    </div>
                    <div class="question-item">
                        <label>3. Activité physique:</label>
                        <input type="range" id="q3" min="1" max="10" value="5">
                        <span class="question-value">5</span>
                    </div>
                    <div class="question-item">
                        <label>4. Gestion des distractions:</label>
                        <input type="range" id="q4" min="1" max="10" value="5">
                        <span class="question-value">5</span>
                    </div>
                    <div class="question-item">
                        <label>5. Satisfaction personnelle:</label>
                        <input type="range" id="q5" min="1" max="10" value="5">
                        <span class="question-value">5</span>
                    </div>
                </div>
                <div class="review-total">
                    <strong>Score total: <span id="totalScore">25</span>/50</strong>
                </div>
            </div>
        `;
    }
    
    submitWeeklyReview() {
        const scores = [];
        for (let i = 1; i <= 5; i++) {
            scores.push(parseInt(document.getElementById(`q${i}`).value));
        }
        
        const totalScore = scores.reduce((sum, score) => sum + score, 0);
        this.data.weeklyScores.push(totalScore);
        
        // Calculer le taux d'intensité
        const averageScore = this.data.weeklyScores.reduce((sum, score) => sum + score, 0) / this.data.weeklyScores.length;
        this.data.intensityRate = (averageScore / 50) * 100;
        
        // Bonus XP pour complétion
        this.addXP(10, `Bilan hebdomadaire (${totalScore}/50)`);
        
        this.closeModal();
        this.updateUI();
        this.saveData();
        
        this.showNotification(`Bilan complété! Score: ${totalScore}/50 (+10 XP)`, 'success');
    }
    
    // Accomplissements
    loadAchievements() {
        this.achievements.forEach(achievement => {
            if (this.data.achievements[achievement.id]) {
                achievement.unlocked = true;
            }
        });
    }
    
    checkAchievements() {
        // Premiers pas
        if (this.data.focusSessions >= 1) {
            this.unlockAchievement('first_focus');
        }
        
        // Objectif quotidien
        if (this.data.dailyXP >= 15) {
            this.unlockAchievement('daily_goal');
        }
        
        // Chasseur de focus
        if (this.data.focusSessions >= 10) {
            this.unlockAchievement('focus_hunter');
        }
        
        // Maître du focus
        if (this.data.focusSessions >= 50) {
            this.unlockAchievement('focus_master');
        }
        
        // Légende vivante
        if (this.data.focusSessions >= 100) {
            this.unlockAchievement('legend');
        }
        
        // Collectionneur XP
        if (this.data.totalXP >= 1000) {
            this.unlockAchievement('xp_collector');
        }
        
        // Transcendant
        if (this.getCurrentRank().badge === 'SSS') {
            this.unlockAchievement('transcendent');
        }
        
        // Marathon runner (4h en une journée)
        if (this.data.totalFocusTime >= 240) { // 4h = 240 min
            this.unlockAchievement('marathon_runner');
        }
        
        // Vérifier le streak pour guerrier hebdomadaire
        if (this.data.streak >= 7) {
            this.unlockAchievement('weekly_warrior');
        }
    }
    
    unlockAchievement(achievementId) {
        if (this.data.achievements[achievementId]) return; // Déjà débloqué
        
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return;
        
        this.data.achievements[achievementId] = true;
        achievement.unlocked = true;
        
        // Ajouter XP bonus
        this.addXP(achievement.xp, `Accomplissement: ${achievement.name}`);
        
        // Notification spéciale
        this.showAchievementModal(achievement);
    }
    
    showAchievements() {
        const achievementsContent = document.getElementById('achievementsContent');
        if (achievementsContent) {
            const groupedAchievements = {
                facile: this.achievements.filter(a => a.difficulty === 'facile'),
                moyen: this.achievements.filter(a => a.difficulty === 'moyen'),
                premium: this.achievements.filter(a => a.difficulty === 'premium'),
                prestigieux: this.achievements.filter(a => a.difficulty === 'prestigieux'),
                précieux: this.achievements.filter(a => a.difficulty === 'précieux')
            };
            
            achievementsContent.innerHTML = Object.entries(groupedAchievements).map(([difficulty, achievements]) => `
                <div class="achievement-group">
                    <h4 class="difficulty-${difficulty}">${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</h4>
                    <div class="achievements-list">
                        ${achievements.map(achievement => `
                            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                                <div class="achievement-icon">${achievement.unlocked ? '🏆' : '🔒'}</div>
                                <div class="achievement-info">
                                    <h5>${achievement.name}</h5>
                                    <p>${achievement.description}</p>
                                    <span class="achievement-xp">+${achievement.xp} XP</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Quêtes
    activateRandomQuests() {
        // Activer des quêtes aléatoirement si le joueur a 7 jours consécutifs à 15+ XP
        if (this.data.streak >= 7) {
            const inactiveQuests = this.quests.filter(q => !this.data.quests[q.id]);
            if (inactiveQuests.length > 0 && Math.random() < 0.3) { // 30% de chance
                const randomQuest = inactiveQuests[Math.floor(Math.random() * inactiveQuests.length)];
                this.activateQuest(randomQuest.id);
            }
        }
    }
    
    activateQuest(questId) {
        if (this.data.quests[questId]) return; // Déjà active
        
        const quest = this.quests.find(q => q.id === questId);
        if (!quest) return;
        
        this.data.quests[questId] = { active: true, completed: false };
        quest.active = true;
        
        this.showNotification(`🎯 Nouvelle quête: ${quest.name}!`, 'success');
    }
    
    // Progression
    showProgression() {
        const progressionContent = document.getElementById('progressionContent');
        if (progressionContent) {
            const intensityLevel = this.getIntensityLevel();
            
            progressionContent.innerHTML = `
                <div class="progression-stats">
                    <div class="stat-card">
                        <h4>Saison Actuelle</h4>
                        <p>Saison ${this.data.season}</p>
                        <p>Semaine ${this.data.week}</p>
                        <p>Rang: ${this.getCurrentRank().name}</p>
                    </div>
                    <div class="stat-card">
                        <h4>Statistiques Totales</h4>
                        <p>XP Total: ${this.data.totalXP}</p>
                        <p>Sessions: ${this.data.focusSessions}</p>
                        <p>Temps total: ${Math.round(this.data.totalFocusTime)}min</p>
                    </div>
                    <div class="stat-card">
                        <h4>Intensité</h4>
                        <p>Taux: ${Math.round(this.data.intensityRate)}%</p>
                        <p>Niveau: ${intensityLevel.label}</p>
                        <p>Bilans complétés: ${this.data.weeklyScores.length}</p>
                    </div>
                </div>
                <div class="weekly-scores">
                    <h4>Historique des bilans hebdomadaires</h4>
                    <div class="scores-list">
                        ${this.data.weeklyScores.length > 0 ? 
                            this.data.weeklyScores.map((score, index) => `
                                <div class="score-item">
                                    <span>Semaine ${index + 1}</span>
                                    <span>${score}/50</span>
                                </div>
                            `).join('') : 
                            '<p>Aucun bilan complété</p>'
                        }
                    </div>
                </div>
            `;
        }
    }

    showRankList() {
        const modal = this.createModal('Rangs & Titres', `
            <div class="rank-list">
                ${this.ranks.map(rank => `
                    <div class="rank-item">
                        <div class="rank-insignia" style="background: ${rank.color}">${rank.badge}</div>
                        <div>
                            <h4>${rank.name} - <span class="rank-title">${rank.title}</span></h4>
                            <p>À partir de ${rank.minXP} XP</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);

        document.body.appendChild(modal);
        this.showModal();
    }
    
    getIntensityLevel() {
        for (const level of this.intensityLevels) {
            if (this.data.intensityRate >= level.min && this.data.intensityRate <= level.max) {
                return level;
            }
        }
        return this.intensityLevels[0];
    }
    
    // Gestion des comptes
    toggleSpotify() {
        if (this.data.connectedAccounts.spotify) {
            this.data.connectedAccounts.spotify = false;
            this.showNotification('Spotify déconnecté', 'info');
            document.getElementById('spotifyToggle').textContent = 'Se connecter';
            document.getElementById('spotifyToggle').classList.remove('connected');
        } else {
            this.authenticateSpotify();
        }
        this.saveData();
    }
    
    toggleGoogle() {
        if (this.data.connectedAccounts.google) {
            this.data.connectedAccounts.google = false;
            this.showNotification('Google Calendar déconnecté', 'info');
            document.getElementById('googleToggle').textContent = 'Se connecter';
            document.getElementById('googleToggle').classList.remove('connected');
        } else {
            this.authenticateGoogle();
        }
        this.saveData();
    }
    
    authenticateSpotify() {
        // Simulation OAuth Spotify
        this.showNotification('Connexion à Spotify...', 'info');
        
        setTimeout(() => {
            this.data.connectedAccounts.spotify = true;
            this.showNotification('Spotify connecté avec succès! 🎵', 'success');
            document.getElementById('spotifyToggle').textContent = 'Connecté';
            document.getElementById('spotifyToggle').classList.add('connected');
            this.saveData();
        }, 1500);
    }
    
    authenticateGoogle() {
        // Simulation OAuth Google
        this.showNotification('Connexion à Google Calendar...', 'info');
        
        setTimeout(() => {
            this.data.connectedAccounts.google = true;
            this.showNotification('Google Calendar connecté avec succès! 📅', 'success');
            document.getElementById('googleToggle').textContent = 'Connecté';
            document.getElementById('googleToggle').classList.add('connected');
            this.saveData();
        }, 1500);
    }
    
    startSpotifyPlaylist() {
        // Simulation de lancement de playlist
        this.showNotification('🎵 Playlist focus lancée sur Spotify', 'success');
    }
    
    // Gestion des données
    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `myRPGLife3_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Données exportées avec succès!', 'success');
    }
    
    resetData() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes vos données? Cette action est irréversible.')) {
            localStorage.removeItem('myRPGLife3_data');
            location.reload();
        }
    }
    
    // Utilitaires
    checkDailyReset() {
        const today = new Date().toDateString();
        if (this.data.lastActiveDate !== today) {
            // Nouveau jour
            if (this.data.dailyXP >= 15) {
                this.data.streak++;
            } else {
                this.data.streak = 0;
            }
            
            // Reset des données quotidiennes
            this.data.dailyXP = 0;
            this.data.mandatorySessionsToday = 0;
            this.data.bonusSessionsUnlocked = false;
            this.data.dailyActivities = {
                sport: 0,
                sleep: { hours: 0, bedTime: 'after24' },
                distractions: { instagram: 0, music: 0 }
            };
            
            this.data.lastActiveDate = today;
            this.saveData();
        }
    }
    
    addRecentActivity(icon, description) {
        const activity = {
            icon,
            description,
            time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        };
        
        this.data.recentActivity.unshift(activity);
        if (this.data.recentActivity.length > 10) {
            this.data.recentActivity.pop();
        }
        
        this.updateRecentActivity();
    }
    
    updateRecentActivity() {
        const container = document.getElementById('recentActivityList');
        if (container && this.data.recentActivity.length > 0) {
            container.innerHTML = this.data.recentActivity.map(activity => `
                <div class="activity-item">
                    <span class="activity-icon">${activity.icon}</span>
                    <span class="activity-text">${activity.description}</span>
                    <span class="activity-time">${activity.time}</span>
                </div>
            `).join('');
        }
    }
    
    // Interface utilisateur
    updateUI() {
        this.updateStats();
        this.updateRankDisplay();
        this.updateGoals();
        this.updateIntensity();
        this.updateFocusStats();
        this.updateActivityDisplays();
        this.updateRecentActivity();
    }
    
    updateStats() {
        document.getElementById('totalXP').textContent = this.data.totalXP;
        document.getElementById('dailyXP').textContent = this.data.dailyXP;
        document.getElementById('streak').textContent = this.data.streak;
    }
    
    updateRankDisplay() {
        const currentRank = this.getCurrentRank();
        const progress = this.getRankProgress();
        
        // Header
        document.getElementById('rankBadge').textContent = currentRank.badge;
        document.getElementById('rankBadge').style.background = currentRank.color;
        document.getElementById('rankTitle').textContent = currentRank.title;
        
        // Avatar
        const avatarElements = document.querySelectorAll('.avatar-image, .rank-avatar, #dashboardAvatar');
        avatarElements.forEach(el => {
            el.style.borderColor = currentRank.color;
            if (el.classList.contains('avatar-image') || el.classList.contains('rank-avatar') || el.id === 'dashboardAvatar') {
                el.style.background = `linear-gradient(45deg, ${currentRank.color}, #00d4ff)`;
                el.textContent = currentRank.avatar;
            }
        });
        
        // Dashboard rank
        document.getElementById('dashboardRankName').textContent = currentRank.name;
        document.getElementById('dashboardRankName').style.background = `linear-gradient(45deg, ${currentRank.color}, #00d4ff)`;
        document.getElementById('dashboardRankName').style.webkitBackgroundClip = 'text';
        document.getElementById('dashboardRankName').style.webkitTextFillColor = 'transparent';
        
        // Progress
        document.getElementById('rankProgress').style.width = `${progress.percentage}%`;
        document.getElementById('rankProgressText').textContent = `${progress.current}/${progress.needed} XP`;
    }
    
    updateGoals() {
        document.getElementById('mandatoryFocusStatus').textContent = `${this.data.mandatorySessionsToday}/2`;
        document.getElementById('dailyXPGoal').textContent = `${this.data.dailyXP}/15`;
        document.getElementById('sportGoal').textContent = `${this.data.dailyActivities.sport}/50`;
        
        // Couleurs selon l'état
        const mandatoryElement = document.getElementById('mandatoryFocusStatus');
        mandatoryElement.style.color = this.data.mandatorySessionsToday >= 2 ? '#10b981' : '#00d4ff';
        
        const xpElement = document.getElementById('dailyXPGoal');
        xpElement.style.color = this.data.dailyXP >= 15 ? '#10b981' : '#00d4ff';
        
        const sportElement = document.getElementById('sportGoal');
        sportElement.style.color = this.data.dailyActivities.sport >= 50 ? '#10b981' : '#00d4ff';
    }
    
    updateIntensity() {
        const intensityLevel = this.getIntensityLevel();
        const percentage = Math.round(this.data.intensityRate);
        
        document.getElementById('intensityValue').textContent = `${percentage}%`;
        document.getElementById('intensityLabel').textContent = intensityLevel.label;
        
        // Cercle de progression
        const circle = document.getElementById('intensityCircle');
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDashoffset = offset;
        circle.style.stroke = intensityLevel.color;
    }
    
    updateFocusStats() {
        document.getElementById('totalSessions').textContent = this.data.focusSessions;
        document.getElementById('todaySessions').textContent = this.data.mandatorySessionsToday;
        document.getElementById('totalFocusTime').textContent = `${Math.round(this.data.totalFocusTime / 60)}h`;
        document.getElementById('mandatoryCompleted').textContent = `${this.data.mandatorySessionsToday}/2`;
    }
    
    updateActivityDisplays() {
        document.getElementById('todaySport').textContent = `${this.data.dailyActivities.sport} min`;
        
        // Mettre à jour les informations de dernière review
        const lastReview = document.getElementById('lastReviewInfo');
        if (lastReview && this.data.weeklyScores.length > 0) {
            const lastScore = this.data.weeklyScores[this.data.weeklyScores.length - 1];
            lastReview.innerHTML = `<p>Dernier bilan: ${lastScore}/50 (${Math.round(this.data.intensityRate)}%)</p>`;
        }
    }
    
    // Modales et notifications
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Auto-suppression après 4 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
    
    showXPGainModal(xp, minutes) {
        const modal = this.createModal('Session Terminée! 🎉', `
            <div class="xp-gain-display">
                <div class="xp-amount">+${xp} XP</div>
                <div class="session-info">
                    <p>Session de ${minutes} minutes complétée!</p>
                    <p>Total XP: ${this.data.totalXP}</p>
                    <p>Rang: ${this.getCurrentRank().name}</p>
                </div>
            </div>
        `);
        
        document.body.appendChild(modal);
        this.showModal();
        
        // Auto-fermeture après 3 secondes
        setTimeout(() => {
            this.closeModal();
        }, 3000);
    }
    
    showRankUpModal(oldRank, newRank) {
        const modal = this.createModal('Montée de Rang! 🚀', `
            <div class="rank-up-display">
                <div class="rank-transition">
                    <div class="old-rank">
                        <div class="rank-badge" style="background: ${oldRank.color}">${oldRank.badge}</div>
                        <div class="rank-name">${oldRank.name}</div>
                    </div>
                    <div class="arrow">→</div>
                    <div class="new-rank">
                        <div class="rank-badge" style="background: ${newRank.color}">${newRank.badge}</div>
                        <div class="rank-name">${newRank.name}</div>
                    </div>
                </div>
                <p>Félicitations! Vous êtes maintenant <strong>${newRank.title}</strong>!</p>
            </div>
        `);
        
        document.body.appendChild(modal);
        this.showModal();
    }
    
    showAchievementModal(achievement) {
        const modal = this.createModal('Accomplissement Débloqué! 🏆', `
            <div class="achievement-unlock">
                <div class="achievement-icon-large">🏆</div>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <div class="achievement-reward">+${achievement.xp} XP</div>
            </div>
        `);
        
        document.body.appendChild(modal);
        this.showModal();
    }
    
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${title}</h3>
                ${content}
                <div class="modal-buttons">
                    <button onclick="app.closeModal()">Fermer</button>
                </div>
            </div>
        `;
        return modal;
    }
    
    showModal() {
        const overlay = document.querySelector('.modal-overlay:last-child');
        if (overlay) {
            overlay.classList.add('active');
        }
    }
    
    closeModal() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('active');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        });
    }
}

// Initialisation de l'application
const app = new MyRPGLife();

// Fonctions globales pour les événements HTML
window.app = app;

// Gestion des sliders dans les modales
document.addEventListener('input', (e) => {
    if (e.target.type === 'range' && e.target.id.startsWith('q')) {
        const valueSpan = e.target.parentNode.querySelector('.question-value');
        if (valueSpan) {
            valueSpan.textContent = e.target.value;
            
            // Mettre à jour le score total
            const totalSpan = document.getElementById('totalScore');
            if (totalSpan) {
                let total = 0;
                for (let i = 1; i <= 5; i++) {
                    const slider = document.getElementById(`q${i}`);
                    if (slider) total += parseInt(slider.value);
                }
                totalSpan.textContent = total;
            }
        }
    }
});

// Gestion des boutons de soumission dans les modales
document.addEventListener('click', (e) => {
    if (e.target.textContent === 'Soumettre' && document.querySelector('.weekly-review-form')) {
        app.submitWeeklyReview();
    }
});

// Ajout du bouton de soumission pour le bilan hebdomadaire
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = `
        .weekly-review-form {
            text-align: center;
        }
        
        .review-questions {
            margin: 20px 0;
        }
        
        .question-item {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
            padding: 10px;
            background: rgba(0, 212, 255, 0.05);
            border-radius: 8px;
        }
        
        .question-item label {
            flex: 1;
            text-align: left;
            font-weight: 500;
        }
        
        .question-item input[type="range"] {
            flex: 1;
            max-width: 150px;
        }
        
        .question-value {
            min-width: 20px;
            font-weight: 700;
            color: var(--accent-blue);
        }
        
        .review-total {
            margin: 20px 0;
            padding: 15px;
            background: linear-gradient(45deg, var(--accent-blue), var(--accent-purple));
            border-radius: 8px;
            color: white;
        }
        
        .xp-gain-display {
            text-align: center;
        }
        
        .xp-amount {
            font-family: var(--font-title);
            font-size: 3rem;
            font-weight: 900;
            color: var(--success-green);
            text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
            margin-bottom: 20px;
        }
        
        .session-info p {
            margin-bottom: 10px;
            color: var(--text-secondary);
        }
        
        .rank-up-display {
            text-align: center;
        }
        
        .rank-transition {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 30px;
            margin: 30px 0;
        }
        
        .rank-transition .rank-badge {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-title);
            font-size: 1.5rem;
            font-weight: 900;
            color: white;
            margin-bottom: 10px;
        }
        
        .rank-transition .rank-name {
            font-weight: 600;
        }
        
        .arrow {
            font-size: 2rem;
            color: var(--accent-blue);
        }
        
        .achievement-unlock {
            text-align: center;
        }
        
        .achievement-icon-large {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        
        .achievement-unlock h4 {
            font-family: var(--font-title);
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: var(--accent-blue);
        }
        
        .achievement-unlock p {
            margin-bottom: 20px;
            color: var(--text-secondary);
        }
        
        .achievement-reward {
            font-family: var(--font-title);
            font-size: 1.2rem;
            font-weight: 700;
            color: var(--success-green);
            background: rgba(16, 185, 129, 0.1);
            padding: 10px 20px;
            border-radius: 20px;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);
});

// Modification de la fonction showWeeklyReview pour inclure le bouton de soumission
MyRPGLife.prototype.showWeeklyReview = function() {
    const modal = this.createModal('Bilan Hebdomadaire', this.getWeeklyReviewHTML() + `
        <div class="modal-buttons">
            <button onclick="app.submitWeeklyReview()">Soumettre</button>
            <button onclick="app.closeModal()">Annuler</button>
        </div>
    `);
    
    // Supprimer les boutons par défaut
    const defaultButtons = modal.querySelector('.modal-buttons');
    if (defaultButtons && defaultButtons.children.length === 1) {
        defaultButtons.remove();
    }
    
    document.body.appendChild(modal);
    this.showModal();
};

console.log('🌙 MyRPGLife 3 - Lunalis initialisé avec succès!');