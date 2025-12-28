
const Habit = require('../model/Habit');
const { ALL_ICONS } = require('../constants/icons');

// Helper function - extract userId from Bearer token
const getUserIdFromAuth = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1]; // the actual token value = userID
};

// GET all habits (without completions)
exports.getHabits = async (req, res) => {
    const userId = getUserIdFromAuth(req);
    if (!userId) {
        return res.status(401).json({ error: 'Authorization required (Bearer token)' });
    }

    try {
        const habits = await Habit.find({ userId }).select('-completions');
        res.json(habits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CREATE new habit
exports.createHabit = async (req, res) => {
    const userId = getUserIdFromAuth(req);
    if (!userId) {
        return res.status(401).json({ error: 'Authorization required' });
    }

    const { name, icon } = req.body;

    if (!name?.trim() || !icon) {
        return res.status(400).json({ error: 'name and icon are required' });
    }

    if (!ALL_ICONS.includes(icon)) {
        return res.status(400).json({ error: 'Invalid icon' });
    }

    try {
        const existing = await Habit.findOne({ userId, icon });
        if (existing) {
            return res.status(400).json({ error: 'This icon is already in use' });
        }

        const habit = new Habit({ name: name.trim(), icon, userId });
        await habit.save();

        res.status(201).json(habit);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// DELETE habit
exports.deleteHabit = async (req, res) => {
    const userId = getUserIdFromAuth(req);
    if (!userId) return res.status(401).json({ error: 'Authorization required' });

    try {
        const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId });
        if (!habit) return res.status(404).json({ error: 'Habit not found or not owned' });

        res.json({ message: 'Habit deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// TOGGLE completion
exports.toggleCompletion = async (req, res) => {
    const userId = getUserIdFromAuth(req);
    if (!userId) return res.status(401).json({ error: 'Authorization required' });

    const { dateStr } = req.body;
    if (!dateStr) return res.status(400).json({ error: 'dateStr is required' });

    const date = new Date(dateStr + 'T00:00:00Z');
    if (isNaN(date.getTime())) return res.status(400).json({ error: 'Invalid date format' });

    try {
        const habit = await Habit.findOne({ _id: req.params.id, userId });
        if (!habit) return res.status(404).json({ error: 'Habit not found or not owned' });

        const existing = habit.completions.find(c => c.date.getTime() === date.getTime());

        if (existing) {
            existing.completed = !existing.completed;
        } else {
            habit.completions.push({ date, completed: true });
        }

        await habit.save();
        res.json({ message: 'Completion updated', habit });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET monthly data
exports.getMonthlyData = async (req, res) => {
    const userId = getUserIdFromAuth(req);
    if (!userId) return res.status(401).json({ error: 'Authorization required' });

    const { year, month } = req.query;
    const y = parseInt(year);
    const m = parseInt(month);

    if (isNaN(y) || isNaN(m) || m < 1 || m > 12) {
        return res.status(400).json({ error: 'Invalid year/month' });
    }

    const start = new Date(Date.UTC(y, m - 1, 1));
    const end = new Date(Date.UTC(y, m, 1));

    try {
        const habits = await Habit.find({ userId });

        const monthlyHabits = habits.map(habit => {
            const monthCompletions = {};
            habit.completions.forEach(c => {
                if (c.date >= start && c.date < end) {
                    monthCompletions[c.date.toISOString().split('T')[0]] = c.completed;
                }
            });
            return {
                id: habit._id,
                name: habit.name,
                icon: habit.icon,
                completed: monthCompletions
            };
        });

        const daysInMonth = new Date(y, m, 0).getDate();

        res.json({ habits: monthlyHabits, daysInMonth });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET available icons
exports.getAvailableIcons = async (req, res) => {
    const userId = getUserIdFromAuth(req);
    if (!userId) return res.status(401).json({ error: 'Authorization required' });

    try {
        const used = await Habit.find({ userId }).distinct('icon');
        const available = ALL_ICONS.filter(icon => !used.includes(icon));
        res.json(available);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};