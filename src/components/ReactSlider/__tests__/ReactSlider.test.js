import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';

import ReactSlider from '../ReactSlider';

window.ResizeObserver =
    window.ResizeObserver ||
    jest.fn().mockImplementation(() => ({
        disconnect: jest.fn(),
        observe: jest.fn(),
        unobserve: jest.fn(),
    }));

describe('<ReactSlider>', () => {
    const addEventListenerMock = jest.fn();
    const removeEventListenerMock = jest.fn();
    it('can render', () => {
        expect(render(<ReactSlider />).baseElement).toMatchSnapshot();
    });

    describe('event handlers', () => {
        beforeEach(() => {
            jest.spyOn(document, 'addEventListener').mockImplementation(addEventListenerMock);
            jest.spyOn(document, 'removeEventListener').mockImplementation(removeEventListenerMock);
        });

        it('does not call any event handlers if the value does not change', async () => {
            const onBeforeChange = jest.fn();
            const onChange = jest.fn();
            const onAfterChange = jest.fn();
            const { container } = render(
                <ReactSlider
                    onBeforeChange={onBeforeChange}
                    onChange={onChange}
                    onAfterChange={onAfterChange}
                    thumbClassName="test-thumb"
                    min={0}
                    step={1}
                />
            );

            const thumb = container.querySelector('.test-thumb.test-thumb-0');

            expect(addEventListenerMock).not.toHaveBeenCalled();

            // simulate focus on thumb
            await fireEvent.focus(thumb);

            // expect(addEventListenerMock).toHaveBeenCalledTimes(3);
            expect(addEventListenerMock.mock.calls[0][0]).toBe('keydown');
            expect(addEventListenerMock.mock.calls[1][0]).toBe('keyup');
            expect(addEventListenerMock.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListenerMock.mock.calls[0][1];

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            act(() => onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} }));

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            act(() => onKeyDown({ key: 'Home', preventDefault: () => {} }));

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            act(() => onKeyDown({ key: 'PageDown', preventDefault: () => {} }));

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();
        });

        it('calls onBeforeChange only once before onChange', async () => {
            const onBeforeChange = jest.fn();
            const onChange = jest.fn();
            const { container } = render(
                <ReactSlider
                    onBeforeChange={onBeforeChange}
                    onChange={onChange}
                    thumbClassName="test-thumb"
                    min={0}
                    step={1}
                />
            );

            const thumb = container.querySelector('.test-thumb.test-thumb-0');

            expect(addEventListenerMock).not.toHaveBeenCalled();

            // simulate focus on thumb
            await fireEvent.focus(thumb);

            // expect(addEventListener).toHaveBeenCalledTimes(3);
            expect(addEventListenerMock.mock.calls[0][0]).toBe('keydown');
            expect(addEventListenerMock.mock.calls[1][0]).toBe('keyup');
            expect(addEventListenerMock.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListenerMock.mock.calls[0][1];

            expect(onBeforeChange).not.toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();

            // simulate keydown
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));

            expect(onBeforeChange).toHaveBeenCalledTimes(1);
            expect(onBeforeChange).toHaveBeenCalledWith(0, 0);
            expect(onBeforeChange.mock.invocationCallOrder[0]).toBeLessThan(
                onChange.mock.invocationCallOrder[0]
            );
            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(1, 0);

            // simulate keydown
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));

            expect(onBeforeChange).toHaveBeenCalledTimes(1);
            expect(onBeforeChange).toHaveBeenCalledWith(0, 0);
            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(2, 0);
        });

        it('calls onChange for every change', async () => {
            const onChange = jest.fn();
            const { container } = render(
                <ReactSlider onChange={onChange} thumbClassName="test-thumb" min={0} step={1} />
            );

            const thumb = container.querySelector('.test-thumb.test-thumb-0');

            // expect(addEventListenerMock).toHaveBeenCalledOnce();

            // simulate focus on thumb
            await fireEvent.focus(thumb);

            // expect(addEventListenerMock).toHaveBeenCalledTimes(3);
            expect(addEventListenerMock.mock.calls[0][0]).toBe('keydown');
            expect(addEventListenerMock.mock.calls[1][0]).toBe('keyup');
            expect(addEventListenerMock.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListenerMock.mock.calls[0][1];

            expect(onChange).not.toHaveBeenCalled();

            // simulate keydown
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(1, 0);

            // simulate keydown
            act(() => onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} }));

            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(0, 0);
        });

        it('calls onAfterChange only once after onChange', async () => {
            const onChange = jest.fn();
            const onAfterChange = jest.fn();
            const { container } = render(
                <ReactSlider
                    onChange={onChange}
                    onAfterChange={onAfterChange}
                    thumbClassName="test-thumb"
                    min={0}
                    step={1}
                />
            );

            const thumb = container.querySelector('.test-thumb.test-thumb-0');

            expect(addEventListenerMock).not.toHaveBeenCalled();

            // simulate focus on thumb
            await fireEvent.focus(thumb);

            // expect(addEventListenerMock).toHaveBeenCalledTimes(3);
            expect(addEventListenerMock.mock.calls[0][0]).toBe('keydown');
            expect(addEventListenerMock.mock.calls[1][0]).toBe('keyup');
            expect(addEventListenerMock.mock.calls[2][0]).toBe('focusout');

            const onKeyDown = addEventListenerMock.mock.calls[0][1];
            const onKeyUp = addEventListenerMock.mock.calls[1][1];

            expect(onChange).not.toHaveBeenCalled();
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));

            expect(onChange).toHaveBeenCalledTimes(1);
            expect(onChange).toHaveBeenCalledWith(1, 0);
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keydown
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));

            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onChange).toHaveBeenCalledWith(2, 0);
            expect(onAfterChange).not.toHaveBeenCalled();

            // simulate keyup
            act(() => onKeyUp());

            expect(onChange).toHaveBeenCalledTimes(2);
            expect(onAfterChange).toHaveBeenCalledTimes(1);
            expect(onAfterChange).toHaveBeenCalledWith(2, 0);
            expect(onAfterChange.mock.invocationCallOrder[0]).toBeGreaterThan(
                onChange.mock.invocationCallOrder[1]
            );
        });

        it('handles left and right arrow keydown events when the slider is horizontal', async () => {
            const { container } = render(
                <ReactSlider min={0} max={10} step={1} thumbClassName="test-thumb" />
            );

            const thumb = container.querySelector('.test-thumb.test-thumb-0');
            const { addEventListener } = document;

            // simulate focus on thumb
            await fireEvent.focus(thumb);

            expect(addEventListener.mock.calls[0][0]).toBe('keydown');
            const onKeyDown = addEventListener.mock.calls[0][1];

            act(() => onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} }));

            const valueTestOne = thumb.getAttribute('aria-valuenow');
            expect(valueTestOne).toBe('0');

            await fireEvent.focus(thumb);
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));

            const valueTestTwo = thumb.getAttribute('aria-valuenow');
            expect(valueTestTwo).toBe('2');
        });

        it('handles left and right arrow keydown events when the slider is horizontal and inverted', async () => {
            const { container } = render(
                <ReactSlider invert min={0} max={10} step={1} thumbClassName="test-thumb" />
            );

            const thumb = container.querySelector('.test-thumb-0');
            const { addEventListener } = document;

            // simulate focus on thumb
            await fireEvent.focus(thumb);

            expect(addEventListener.mock.calls[0][0]).toBe('keydown');

            const onKeyDown = addEventListener.mock.calls[0][1];

            act(() => onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} }));
            act(() => onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} }));
            act(() => onKeyDown({ key: 'ArrowLeft', preventDefault: () => {} }));

            const valueTestOne = thumb.getAttribute('aria-valuenow');
            expect(valueTestOne).toBe('3');

            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));
            act(() => onKeyDown({ key: 'ArrowRight', preventDefault: () => {} }));

            const valueTestTwo = thumb.getAttribute('aria-valuenow');
            expect(valueTestTwo).toBe('1');
        });
    });

    it('replaces state value when props value changes', () => {
        const mockRenderThumb = jest.fn();
        const mockFirstValue = 40;
        const mockSecondValue = 80;
        const { rerender } = render(
            <ReactSlider
                thumbClassName="test-thumb"
                renderThumb={mockRenderThumb}
                value={mockFirstValue}
                min={0}
                step={1}
            />
        );
        expect(mockRenderThumb).toHaveBeenCalledTimes(1);
        expect(mockRenderThumb.mock.calls[0][1].value).toBe(mockFirstValue);

        act(() => {
            rerender(
                <ReactSlider
                    thumbClassName="test-thumb"
                    renderThumb={mockRenderThumb}
                    value={mockSecondValue}
                    min={0}
                    step={1}
                />
            );
        });

        expect(mockRenderThumb).toHaveBeenCalledTimes(2);
        expect(mockRenderThumb.mock.calls[1][1].value).toBe(mockSecondValue);
    });
});
