import express from 'express';
import { supabase } from '../config/supabase_management';

const router = express.Router();

// GET all stops
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stops')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST Create a new stop
router.post('/', async (req: any, res: any) => {
    const { stop_name, stop_code, latitude, longitude, zone, is_active } = req.body;

    if (!stop_name || !stop_code) {
        return res.status(400).json({ success: false, error: 'Stop Name and Stop Code are required' });
    }

    try {
        const { data, error } = await supabase
            .from('stops')
            .insert([{ stop_name, stop_code, latitude, longitude, zone, is_active }])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, data: data![0] });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// PUT Update an existing stop
router.put('/:id', async (req: any, res: any) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const { data, error } = await supabase
            .from('stops')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ success: false, error: 'Stop not found' });

        res.status(200).json({ success: true, data: data[0] });
    } catch (err: any) {
        res.status(400).json({ success: false, error: err.message });
    }
});

// DELETE a stop
router.delete('/:id', async (req: any, res: any) => {
    const { id } = req.params;

    try {
        const { error } = await supabase
            .from('stops')
            .delete()
            .eq('id', id);

        if (error) throw error;

        res.status(200).json({ success: true, message: 'Stop deleted successfully' });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
