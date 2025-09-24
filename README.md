# Canadian Take Home

## Overview

Take Home is a comprehensive web application designed to assist Canadians in managing their personal
finances. Built with React and TypeScript, this modern tool provides essential financial planning capabilities tailored
specifically for the Canadian tax system and financial landscape. Whether you're planning your annual budget,
calculating tax obligations, or analyzing your financial position across different provinces, this application offers
the tools you need to make informed financial decisions.

The application serves as a one-stop solution for two critical aspects of personal finance management: accurate tax
calculations that account for both federal and provincial variations, and intuitive budget planning with powerful
visualization capabilities.

## Features

### Income and Tax Calculator

The tax calculator provides calculations of your tax obligations based on your specific circumstances and
province of residence. This tool takes into account the complex interplay between federal and provincial tax systems
across Canada, ensuring accurate results regardless of where you live.

Users can input their annual income along with their province of residence and other relevant financial details. The
calculator then processes this information to provide a comprehensive breakdown of all applicable taxes and deductions.
The results include detailed calculations for federal income tax, provincial or territorial tax, Canada Pension Plan (
CPP) or Quebec Pension Plan (QPP) contributions, and Employment Insurance (EI) premiums.

The interface is designed with responsiveness in mind, ensuring a seamless experience across desktop computers, tablets,
and mobile devices. The calculations update in real-time as you modify your inputs, allowing for easy scenario planning
and financial forecasting.

### Budget Visualizer

This feature allows you to input expenses across various budget categories such as housing, food, transportation,
entertainment, savings, and other personal expenses.

Once your budget data is entered, the application generates compelling visual representations of your spending patterns
and financial allocation. These visualizations help you quickly identify areas where you might be overspending or where
you have opportunities to optimize your budget.

The tool includes robust export functionality, enabling you to save your budget data in CSV format for further analysis
in spreadsheet applications or for record-keeping purposes. This feature ensures that your financial planning work can
be easily integrated into your broader financial management workflow.

## Development Setup

### Running the Application Locally

To set up the development environment for the Canadian Take Home application, follow these steps:

1. **Clone the Repository**: Start by cloning the repository to your local machine using Git.

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install Dependencies**: Use the package manager of your choice to install the necessary dependencies for the
   project.

    ```bash
    pnpm install
    ```

3. **Start the Development Server**: Launch the development server to run the application locally.

    ```bash
    pnpm dev
    ```

4. **Access the Application**: Open your web browser and navigate to `http://localhost:3000` to view the application.

### Testing

To run the test suite and ensure that all components are functioning correctly, use the following command:

```bash
pnpm test
```

Linting can be performed using:

```bash
pnpm run lint
````

### Building for Production

To create a production build of the application, use the following command:

```bash
pnpm run build
```

## References

| Name                                   | URL                                                                                                                                                                                       |
|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Canadian Province and Territory Codes  | https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/completing-slips-summaries/financial-slips-summaries/return-investment-income-t5/provincial-territorial-codes.html |
| Canadian Tax Rates and Income brackets | https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html                 |
| Canada CPP 2025                        | https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/cpp-contribution-rates-maximums-exemptions.html   |
| Canada QPP 2025                        | https://www.rrq.gouv.qc.ca/en/programmes/regime_rentes/travail_cotisations/Pages/travail_cotisations.aspx                                                                                 |
| Canada EI 2025                         | https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/employment-insurance-ei/ei-premium-rates-maximums.html#h_2                |
| Canada QPIP                            | https://www.rqap.gouv.qc.ca/en/about-the-plan/general-information/premiums-and-maximum-insurable-earnings                                                                                 |
| Next.js (App Router)                   | https://nextjs.org/docs                                                                                                                                                                   |
| Shadcn UI                              | https://ui.shadcn.com/docs                                                                                                                                                                |
| Tanstack forms                         | https://tanstack.com/form/latest                                                                                                                                                          |
| Papaparse for JSON to CSV              | https://github.com/mholt/PapaParse                                                                                                                                                        |