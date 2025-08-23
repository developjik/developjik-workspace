import { test, expect } from '@playwright/test';

test.describe('Storybook Integration', () => {
  test('should load Storybook', async ({ page }) => {
    await page.goto('http://localhost:6006');
    
    await expect(page).toHaveTitle(/Storybook/);
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });

  test('should navigate to Button stories', async ({ page }) => {
    await page.goto('http://localhost:6006');
    
    // Wait for Storybook to load
    await page.waitForSelector('[data-testid="sidebar"]', { timeout: 10000 });
    
    // Look for Button story in sidebar
    const buttonStory = page.locator('[data-testid="sidebar"] >> text=Button').first();
    if (await buttonStory.isVisible()) {
      await buttonStory.click();
      
      // Should show button component
      await expect(page.locator('#storybook-root button')).toBeVisible();
    }
  });

  test('should interact with Button component in Storybook', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-button--primary');
    
    // Wait for story to load
    await page.waitForSelector('#storybook-root button', { timeout: 10000 });
    
    const button = page.locator('#storybook-root button');
    await expect(button).toBeVisible();
    
    // Test button interaction in Storybook
    page.once('dialog', async dialog => {
      expect(dialog.type()).toBe('alert');
      await dialog.accept();
    });
    
    await button.click();
  });

  test('should test Input component controls', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-input--default');
    
    // Wait for story to load
    await page.waitForSelector('#storybook-root input', { timeout: 10000 });
    
    const input = page.locator('#storybook-root input');
    await expect(input).toBeVisible();
    
    // Test input in Storybook
    await input.fill('Storybook test input');
    await expect(input).toHaveValue('Storybook test input');
    
    // Test controls panel if available
    const controlsTab = page.locator('[role="tab"]:has-text("Controls")');
    if (await controlsTab.isVisible()) {
      await controlsTab.click();
      
      // Look for placeholder control
      const placeholderControl = page.locator('[data-testid="control-placeholder"]');
      if (await placeholderControl.isVisible()) {
        await placeholderControl.fill('Updated placeholder');
        
        // Check if input placeholder updated
        await expect(input).toHaveAttribute('placeholder', 'Updated placeholder');
      }
    }
  });

  test('should test responsive viewports', async ({ page }) => {
    await page.goto('http://localhost:6006/?path=/story/ui-button--primary');
    
    // Wait for story to load
    await page.waitForSelector('#storybook-root button', { timeout: 10000 });
    
    // Look for viewport toolbar
    const viewportButton = page.locator('[title*="viewport"], [aria-label*="viewport"]').first();
    
    if (await viewportButton.isVisible()) {
      await viewportButton.click();
      
      // Try to select mobile viewport
      const mobileOption = page.locator('text=Mobile');
      if (await mobileOption.isVisible()) {
        await mobileOption.click();
        
        // Component should still be visible in mobile viewport
        await expect(page.locator('#storybook-root button')).toBeVisible();
      }
    }
  });
});