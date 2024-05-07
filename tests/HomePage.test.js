import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import HomePage from '../src/components/login/HomePage';

jest.mock('axios');

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

beforeAll(() => {
    console.log = jest.fn();
    console.error = jest.fn();
});

afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
});

describe('HomePage', () => {
    describe('LoginForm', () => {
        beforeEach(() => {
            render(<HomePage />);
        });

        it('should render login inputs and button', () => {
            expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
        });

        it('updates state on input change', () => {
            fireEvent.change(screen.getByPlaceholderText('Username'), {
                target: { value: 'testuser' }
            });
            fireEvent.change(screen.getByPlaceholderText('Password'), {
                target: { value: 'password123' }
            });
            expect(screen.getByPlaceholderText('Username').value).toBe('testuser');
            expect(screen.getByPlaceholderText('Password').value).toBe('password123');
        });

        it('shows alert if submit with empty fields', () => {
            window.alert = jest.fn();
            fireEvent.submit(screen.getByRole('button', { name: 'Log In' }));
            expect(window.alert).toHaveBeenCalledWith('Please fill out all fields');
        });

        it('submits form and redirects on successful login', async () => {
            const { assign } = window.location;
            delete window.location;
            window.location = { assign: jest.fn() };
            const mockResponse = { data: { id: '12345', email: 'test@example.com' } };
            axios.post.mockResolvedValue(mockResponse);
            fireEvent.change(screen.getByPlaceholderText('Username'), {
                target: { value: 'testuser' }
            });
            fireEvent.change(screen.getByPlaceholderText('Password'), {
                target: { value: 'password123' }
            });
            fireEvent.submit(screen.getByRole('button', { name: 'Log In' }));
            window.location = { assign };
        });

        it('shows error alert on failed login', async () => {
            axios.post.mockRejectedValue(new Error('Failed to login'));
            window.alert = jest.fn();
            fireEvent.submit(screen.getByRole('button', { name: 'Log In' }));
            expect(window.alert).toHaveBeenCalledWith('Please fill out all fields');
        });
    });

    describe('GameDescription', () => {
        it('renders game information correctly', () => {
            render(<HomePage />);
            expect(screen.getByText('Mexican Train Dominoes')).toBeInTheDocument();
            expect(screen.getByText('Online multiplayer game with friends, stats, etc.')).toBeInTheDocument();
        });
    });

    describe('LoginSection', () => {
        it('renders the LoginForm and the signup link', () => {
            render(<HomePage />);
            expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
            expect(screen.getByText('Sign Up')).toBeInTheDocument();
        });
    });
});
