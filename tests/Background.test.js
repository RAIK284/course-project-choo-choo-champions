import React from 'react';
import { render } from '@testing-library/react';
import Background from '../src/components/universal/Background';

describe('Background Component', () => {
    it('renders without crashing', () => {
        render(<Background />);
    });
});
