import { test, expect } from '@playwright/test';

test.describe('UI Components', () => {
  test('should interact with buttons', async ({ page }) => {
    await page.goto('/');
    
    // Look for buttons on the page
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    if (buttonCount > 0) {
      const firstButton = buttons.first();
      
      // Test button interaction
      await expect(firstButton).toBeVisible();
      await expect(firstButton).toBeEnabled();
      
      // Click button and handle potential alerts
      page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        await dialog.accept();
      });
      
      await firstButton.click();
    }
  });

  test('should handle form inputs', async ({ page }) => {
    await page.goto('/');
    
    // Look for input fields
    const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      const firstInput = inputs.first();
      
      await expect(firstInput).toBeVisible();
      await expect(firstInput).toBeEnabled();
      
      // Test input interaction
      await firstInput.fill('test input');
      await expect(firstInput).toHaveValue('test input');
      
      // Clear input
      await firstInput.clear();
      await expect(firstInput).toHaveValue('');
    }
  });

  test('should handle modal interactions', async ({ page }) => {
    await page.goto('/');
    
    // Look for modal trigger buttons
    const modalTriggers = page.locator('button:has-text("Open"), button:has-text("Modal")');
    const triggerCount = await modalTriggers.count();
    
    if (triggerCount > 0) {
      const trigger = modalTriggers.first();
      await trigger.click();
      
      // Check if modal appears
      const modal = page.locator('[role="dialog"], .modal, .fixed.inset-0');
      await expect(modal).toBeVisible({ timeout: 5000 });
      
      // Try to close modal with escape key
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible({ timeout: 5000 });
    }
  });
});