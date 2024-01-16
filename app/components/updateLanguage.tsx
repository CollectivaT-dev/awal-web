// script.ts

// Define an interface for the item
import { useState } from 'react';
export interface Item {
    value: string;
}

// Array to store added items
export const addedItems: Item[] = [];

export function addItem(selectedItemValue: string) {
    // Check if the item already exists
    if (addedItems.some((item) => item.value === selectedItemValue)) {
        alert('Item already exists!');
        return;
    }

    // Add the item to the list
    const newItem: Item = { value: selectedItemValue };
    addedItems.push(newItem);

    // Update the displayed items
    updateItemList();
}

export function removeItem(index: number) {
    // Remove the item from the array
    addedItems.splice(index, 1);

    // Update the displayed items
    updateItemList();
}

export function updateItemList() {
    // Get the added items ul element
    const addedItemsList = document.querySelector(
        'addedItems',
    ) as HTMLUListElement;

    // Clear the current list
    if (addedItemsList) {
        addedItemsList.innerHTML = '';
    }
    // Populate the list with the added items
    addedItems.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.value;

        // Add a remove button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = () => removeItem(index);

        li.appendChild(removeButton);
        addedItemsList.appendChild(li);
    });
}
