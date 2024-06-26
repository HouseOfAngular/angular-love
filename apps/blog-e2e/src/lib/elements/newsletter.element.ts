import { Locator } from '@playwright/test';

export const createNewsletterElement = (form: Locator) => {
  const emailInput = form.getByRole('textbox', {});
  const submitButton = form.getByRole('button');
  const checkbox = form.getByRole('checkbox');

  return {
    form,
    emailInput,
    submitButton,
    checkbox,
    fillEmailInput: async (email: string) => {
      await emailInput.fill(email);
    },
    submitNewsletter: async () => {
      await submitButton.click();
    },
    checkCheckbox: async () => {
      await checkbox.check();
    },
  };
};
