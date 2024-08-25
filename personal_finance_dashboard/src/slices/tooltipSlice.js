import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isVisible: false,
}

const tooltipSlice = createSlice({
    name: 'tooltip',
    initialState,
    reducers: {
        showTooltip(state) {
            state.isVisible = true;
        },
        hideTooltip(state) {
            state.isVisible = false;
        },
        toggleTooltip(state) {
            state.isVisible = !state.isVisible;
        }
    }
})

export default tooltipSlice.reducer;
export const { showTooltip, hideTooltip, toggleTooltip } = tooltipSlice.actions;
export const selectUserTooltipVisibility = (state) => state.tooltip.isVisible;