import React from 'react';
import { render } from '@testing-library/react';
import Background from '../src/components/Background';

describe('Background Component', () => {
    it('renders without crashing', () => {
        render(<Background />);
    });
});
