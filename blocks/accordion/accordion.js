import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'accordion-container';

  [...block.children].forEach((row, index) => {
    const accordionItem = document.createElement('div');
    accordionItem.className = 'accordion-item';

    const [questionCell, answerCell] = row.children;

    // Create accordion header (question/headline)
    const accordionHeader = document.createElement('button');
    accordionHeader.className = 'accordion-header';
    accordionHeader.setAttribute('aria-expanded', 'false');
    accordionHeader.setAttribute('aria-controls', `accordion-content-${index}`);
    accordionHeader.innerHTML = `
      ${questionCell.innerHTML}
      <span class="accordion-icon" aria-hidden="true">+</span>
    `;

    // Create accordion content (answer/description)
    const accordionContent = document.createElement('div');
    accordionContent.className = 'accordion-content';
    accordionContent.id = `accordion-content-${index}`;
    accordionContent.setAttribute('aria-hidden', 'true');
    accordionContent.innerHTML = answerCell.innerHTML;

    // Add click event listener
    accordionHeader.addEventListener('click', () => {
      const isExpanded = accordionHeader.getAttribute('aria-expanded') === 'true';

      // Close all other accordion items
      accordionContainer.querySelectorAll('.accordion-header').forEach(header => {
        header.setAttribute('aria-expanded', 'false');
        header.querySelector('.accordion-icon').textContent = '+';
        const content = document.getElementById(header.getAttribute('aria-controls'));
        content.setAttribute('aria-hidden', 'true');
        content.style.maxHeight = '0';
      });

      // Toggle current item
      if (!isExpanded) {
        accordionHeader.setAttribute('aria-expanded', 'true');
        accordionHeader.querySelector('.accordion-icon').textContent = '−';
        accordionContent.setAttribute('aria-hidden', 'false');
        accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
      }
    });

    moveInstrumentation(row, accordionItem);
    accordionItem.append(accordionHeader, accordionContent);
    accordionContainer.append(accordionItem);
  });

  block.textContent = '';
  block.append(accordionContainer);
}
