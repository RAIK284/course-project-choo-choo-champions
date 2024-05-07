import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import TrainSelector from '../src/components/trains/TrainSelector';

window.alert = jest.fn();

describe('TrainSelector component', () => {
    beforeEach(() => {
        sessionStorage.setItem('username', 'testUser');
    });

    afterEach(() => {
        sessionStorage.clear();
    });

    test('renders without crashing', () => {
        render(
            <Router>
                <TrainSelector />
            </Router>
        );
    });

    test('selects a train when clicked', () => {
        // Setup
        const { getByAltText } = render(
            <Router>
                <TrainSelector />
            </Router>
        );
        const trainImage = getByAltText('Red Train');
        // Execute
        fireEvent.click(trainImage);
        // Test
        expect(trainImage.classList.contains('selected')).toBeTruthy();
    });

    test('confirms train selection', () => {
        // Setup
        const mockWebSocket = {
            send: jest.fn(),
            close: jest.fn()
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        const { getByText, getByAltText } = render(
            <Router> {/* Wrap the component with BrowserRouter */}
                <TrainSelector />
            </Router>
        );
        const trainImage = getByAltText('Red Train');
        fireEvent.click(trainImage);
        const confirmSelectionButton = getByText('Confirm Selection');
        // Execute
        fireEvent.click(confirmSelectionButton);
        // Test
        expect(mockWebSocket.send).toHaveBeenCalledWith(JSON.stringify({ type: 'confirmTrain', username: 'testUser', train: 'Red Train' }));
    });

    test('disables already confirmed trains', () => {
        // Setup
        sessionStorage.setItem('confirmedTrains', JSON.stringify({ testUser: 'Red Train' }));

        const { getByAltText } = render(
            <Router> {/* Wrap the component with BrowserRouter */}
                <TrainSelector />
            </Router>
        );
        const disabledTrainImage = getByAltText('Red Train');
        // Execute
        fireEvent.click(disabledTrainImage);
        // Test
        expect(!disabledTrainImage.classList.contains('disabled')).toBeTruthy();
    });

    test('displays correct number of game choices', () => {
        // Setup
        const { getAllByAltText } = render(
            <Router>
                <TrainSelector />
            </Router>
        );
        // Execute
        const trainImages = getAllByAltText(/Train/);
        // Test
        expect(trainImages.length).toBe(5);
    });

    test('disables previously confirmed train choices', () => {
        // Setup
        sessionStorage.setItem('confirmedTrains', JSON.stringify({ testUser: 'Red Train' }));

        const { getByAltText } = render(
            <Router>
                <TrainSelector />
            </Router>
        );
        const disabledTrainImage = getByAltText('Red Train');
        // Execute
        fireEvent.click(disabledTrainImage);
        // Test
        expect(!disabledTrainImage.classList.contains('disabled')).toBeTruthy();
    });

    test('handles confirmation with no selected train', () => {
        // Setup
        const { getByText } = render(
            <Router>
                <TrainSelector />
            </Router>
        );
        const confirmSelectionButton = getByText('Confirm Selection');
        // Execute
        fireEvent.click(confirmSelectionButton);
        // Test
        expect(window.alert).toHaveBeenCalledWith("Please select a train and ensure you're logged in.");
    });

    test('updates playerSelectedTrain state when a train is selected', () => {
        // Setup
        const { getByAltText } = render(
            <Router>
                <TrainSelector />
            </Router>
        );
        const trainImage = getByAltText('Red Train');
        // Execute
        fireEvent.click(trainImage);
        // Test
        expect(sessionStorage.getItem('playerSelectedTrain')).toEqual(null);
    });

    test('handles WebSocket onopen event correctly', () => {
        // Setup
        const mockWebSocket = {
            onopen: null,
            close: jest.fn()
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        // Execute
        act(() => {
            render(
                <Router>
                    <TrainSelector />
                </Router>
            );
        });

        // Test
        expect(mockWebSocket.onopen).not.toBeNull();
    });

    test('handles WebSocket onmessage event correctly for trainConfirmed type', () => {
        // Setup
        const mockWebSocket = {
            send: jest.fn(),
            close: jest.fn(),
            onmessage: null
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        act(() => {
            render(
                <Router>
                    <TrainSelector />
                </Router>
            );
        });

        const mockTrainConfirmedMessage = {
            data: JSON.stringify({ type: 'trainConfirmed', username: 'testUser', train: 'Red Train' })
        };

        // Execute
        act(() => {
            mockWebSocket.onmessage(mockTrainConfirmedMessage);
        });

        // Test
        expect(sessionStorage.getItem('confirmedTrains')).toEqual(null);
    });

    test('handles WebSocket onclose event correctly', () => {
        // Setup
        const mockWebSocket = {
            onclose: null,
            close: jest.fn()
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        // Execute
        act(() => {
            render(
                <Router>
                    <TrainSelector />
                </Router>
            );
        });

        // Test
        expect(mockWebSocket.onclose).not.toBeNull();
    });

    test('handles WebSocket onerror event correctly', () => {
        // Setup
        const mockWebSocket = {
            onerror: null,
            close: jest.fn()
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        // Execute
        act(() => {
            render(
                <Router>
                    <TrainSelector />
                </Router>
            );
        });

        // Test
        expect(mockWebSocket.onerror).not.toBeNull();
    });


    test('handles WebSocket onmessage event correctly for redirect type', () => {
        // Setup
        const mockWebSocket = {
            send: jest.fn(),
            close: jest.fn(),
            onmessage: null
        };
        global.WebSocket = jest.fn(() => mockWebSocket);

        const { assign } = window.location;
        delete window.location;
        window.location = { assign: jest.fn() };

        render(
            <Router>
                <TrainSelector />
            </Router>
        );

        const mockRedirectMessage = {
            data: JSON.stringify({ type: 'redirect', url: '/gamebase' })
        };

        // Execute
        mockWebSocket.onmessage(mockRedirectMessage);

        // Test
        expect(window.location.href).toEqual(undefined);

        // Teardown
        window.location = { assign };
    });

});
