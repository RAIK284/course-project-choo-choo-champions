import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import DashboardPage from '../src/components/profile/DashboardPage';
import '@testing-library/jest-dom';

jest.mock('axios');

const renderWithRouter = (component) => {
    return render(<Router>{component}</Router>);
};

describe('DashboardPage', () => {

    it('renders and makes an API call for stats', async () => {
        // Setup
        axios.get.mockResolvedValue({
            data: {
                totalGameWins: 5,
                totalRoundWins: 10,
                totalPoints: 1000,
                totalGames: 20,
                totalRounds: 40
            }
        });
        // Execute
        renderWithRouter(<DashboardPage />);
        await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
        // Test
        expect(screen.getByText(/Play a Game/)).toBeInTheDocument();
        expect(screen.getByText(/'s Stats/)).toBeInTheDocument();
    });
});

it('displays user statistics after fetching', async () => {
    // Setup
    axios.get.mockResolvedValue({
        data: {
            totalGameWins: 5,
            totalRoundWins: 10,
            totalPoints: 1000,
            totalGames: 20,
            totalRounds: 40
        }
    });
    // Execute
    renderWithRouter(<DashboardPage />);
    // Test
    await waitFor(() => {
        expect(screen.getByText('Total Games: 20')).toBeInTheDocument();
        expect(screen.getByText('Average PPG: 50.00')).toBeInTheDocument();
    });
});

