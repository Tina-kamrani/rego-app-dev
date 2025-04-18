export const validateHazard = (hazard) => {
    if (!hazard.value) {
        return { ...hazard, error: "Pakollinen tieto puuttuu..." };
    }
    return { ...hazard, error: '' };
};

export const validateFactor = (factor) => {
    if (!factor.value) {
        return { ...factor, error: "Pakollinen tieto puuttuu..." };
    }
    return { ...factor, error: '' };
};

export const validateEvent = (event) => {
    if (!event.value) {
        return { ...event, error: "Pakollinen tieto puuttuu..." };
    }
    return { ...event, error: '' };
};