export const getNormalizedScore = (score: string) => {
    const percentageRegex = /^(\d+(\.\d+)?)%$/;
    const fractionRegex = /^(\d+(\.\d+)?)\/(\d+(\.\d+)?)$/;

    let normalizedScore = 0;

    if (percentageRegex.test(score)) {
        // Remove the '%' sign and convert to a number
        const percentage = parseFloat(score.replace('%', ''));
        normalizedScore = percentage;
    } else if (fractionRegex.test(score)) {
        // Extract the numerator and denominator from the fraction
        const [numerator, denominator] = score.split('/').map(parseFloat);
        normalizedScore = Math.round((numerator / denominator) * 100);
    }

    // Make sure the normalized score is within the 1-100 range
    normalizedScore = Math.max(1, Math.min(100, normalizedScore));

    return normalizedScore;
};
