import React, { createContext, useState, useEffect } from 'react';

export const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    // Safety Finding
    const [reportData, setReportData] = useState({
        name: { value: '', error: '' },
        email: { value: '', error: '' },
        unit: { value: '', error: '' },
        date: { value: new Date().toLocaleDateString() },
        time: { value: new Date().toLocaleTimeString() },
        place: { value: '', error: '' },
        positive: 0,
        hazard: { value: '', error: '' },
        factor: { value: '', error: '' },
        measure: { value: '', error: '' },
        correctiveActionsCompleted: { value: false, error: '' },
        environmentRelated: { value: false, error: '' }, 
        selectedRisks: {},
        files: [],
    });

    const updateReportData = (field, value) => {
        setReportData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const clearReportData = () => {
        setReportData({
            name: { value: '', error: '' },
            email: { value: '', error: '' },
            unit: { value: '', error: '' },
            date: { value: new Date().toLocaleDateString() },
            time: { value: new Date().toLocaleTimeString() },
            place: { value: '', error: '' },
            positive: 0,
            hazard: { value: '', error: '' },
            factor: { value: '', error: '' },
            measure: { value: '', error: '' },
            correctiveActionsCompleted: { value: false, error: '' },
            environmentRelated: { value: false, error: '' }, 
            selectedRisks: {},
            files: [],
        });
    };

    // Report danger
    const [reportDangerData, setReportDangerData] = useState({
        // Used for the Submitted Report
        Description: { value: '', error: '' },
        Reasons: { value: '', error: '' },
        PreventiveMeasures: { value: '', error: '' },
        EntityType: 3,
        isAdditional: true,
        PlaceHappened: { value: '', error: '' },
        InjuredPersonID: { value: '', error: '' },
        InjuredPersonName: { value: '', error: '' },
        InjuredPersonCompany: { value: '', error: '' },
        ReportedBehalfPerson: { value: '', error: '' },
        ViolenceInvolved: { value: false, error: '' },
        MedicalCareRequired: { value: false, error: '' },
        DateHappened: { value: null, error: '' },
        TimeHappened: { value: null, error: '' },
        files: [],
        // Used for the hidden params of the Report
        eventType: { value: 'Läheltä piti', error: '' },
        personType: { value: '', error: '' },
        isPlace: { value: false, error: '' },
        isSameAsDeclarer: { value: false, error: '' },
    });
    
    const updateReportDangerData = (field, value) => {
        setReportDangerData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const cleanReportDangerData = () => {
        setReportDangerData({
            // Used for the Submitted Report
            Description: { value: '', error: '' },
            Reasons: { value: '', error: '' },
            PreventiveMeasures: { value: '', error: '' },
            EntityType: 3,
            isAdditional: true,
            PlaceHappened: { value: '', error: '' },
            InjuredPersonID: { value: '', error: '' },
            InjuredPersonName: { value: '', error: '' },
            InjuredPersonCompany: { value: '', error: '' },
            ReportedBehalfPerson: { value: '', error: '' },
            ViolenceInvolved: { value: false, error: '' },
            MedicalCareRequired: { value: false, error: '' },
            DateHappened: { value: null, error: '' },
            TimeHappened: { value: null, error: '' },
            files: [],
            // Used for the hidden params of the Report
            eventType: { value: 'Läheltä piti', error: '' },
            personType: { value: '', error: '' },
            isPlace: { value: false, error: '' },
            isSameAsDeclarer: { value: false, error: '' },
        });
    };

    
    const addFile = (newFile, path = 2) => {
        if (path === 2) {
            setReportData(prev => ({
                ...prev,
                files: [...prev.files, newFile]
            }));
        } else if (path === 3) {
            setReportDangerData(prev => ({
                ...prev,
                files: [...prev.files, newFile]
            }));
        } else if (path === 5) {
            setBreachData(prev => ({
                ...prev,
                files: [...prev.files, newFile]
            }));
        } 
    };

    const removeFile = (uri, path = 2) => {
        if (path === 2) {
            setReportData(prev => ({
            ...prev,
                files: prev.files.filter(file => file.uri !== uri)
            }));
        } else if (path === 3) {
            setReportDangerData(prev => ({
                ...prev,
                files: prev.files.filter(file => file.uri !== uri)
            }));
        } else if (path === 5) {
            setBreachData(prev => ({
                ...prev,
                files: prev.files.filter(file => file.uri !== uri)
            }));
        }
    };

    // Security Breach
    const [breachData, setBreachData] = useState({
        safetyCategory: { value: 'Matkustajaturvallisuus', error: '' },
        incidentType: { value: '', error: '' },
        eventLocation: { value: '', error: '' },
        disturbanceOccured: { value: '', error: '' },
        locationDetails: { value: '', error: '' },
        hasToolsInPossession: { value: '', error: '' },
        externalHelp: { value: {
            guard: false,
            police: false,
            firstAid: false,
        }, error: '' },
        passengerTrainCode: { value: '', error: '' },
        commuterTrainCode: { value: '', error: '' },
        injuryType: { value: '', error: '' },
        trafficSituation: { value: '', error: '' },
        passengerAction: { value: '', error: '' },
        doorJam: { value: '', error: '' },
        platformFall: { value: '', error: '' },
        violenceType: { value: '', error: '' },
        location: { value: '', error: '' },
        locationDetail: { value: '', error: '' },
        hasToolsUsed: { value: '', error: '' },
        damageType: { value: '', error: '' },
        propertyDamageLocation: { value: '', error: '' },
        equipmentID: { value: '', error: '' },
        localTrainID: { value: '', error: '' },
        passengerTrainID: { value: '', error: '' },
        option2Value: { value: '', error: '' },
        owner: { value: '', error: '' },
        eventType: { value: '', error: '' },
        safetyDeviceElement: { value: '', error: '' },
        identifier: { value: '', error: '' },
        unitIdentifier: { value: '', error: '' },
        equipmentType: { value: '', error: '' },
        equipmentIdentifier: { value: '', error: '' },
        option21Value: { value: '', error: '' },
        trafficMode: { value: '', error: '' },
        routeId: { value: '', error: '' },
        stopId: { value: '', error: '' },
        option3Value: { value: '', error: '' },
        substanceName: { value: '', error: '' },
        ykNumber: { value: '', error: '' },
        substanceAmountEstimate: { value: '', error: '' },
        substanceTarget: { value: {
            soilOrWater: false,
            air: false,
            sewage: false,
        }, error: '' },
        landOwner: { value: '', error: '' },
        trafficType: { value: '', error: '' },
        vehicleType: { value: '', error: '' },
        vehicleSeries: { value: '', error: '' },
        vehicleNumber: { value: '', error: '' },
        influence: { value: '', error: '' },
        firstAidGiven: { value: '', error: '' },
        emergencyServicesRequired: { value: '', error: '' },
        evenNature: { value: '', error: '' },
        city: { value: '', error: '' },
        streetAddress: { value: '', error: '' },
        plCarRegistration: { value: '', error: '' },
        plkNumber: { value: '', error: '' },
        opponentRegistration: { value: '', error: '' },
        detailedEventLocation: { value: '', error: '' },
        option9Value: { value: '', error: '' },
        securityNotification: { value: false, error: '' },
        personType: { value: 'vr', error: '' },
        personName: { value: '', error: '' },
        companyName: { value: '', error: '' },
        description: { value: '', error: '' },
        measure: { value: '', error: '' },
        reason: { value: '', error: '' },
        eventNature: { value: '', error: '' },
        isNearMissSituation: {value: false, error: ''},
        deviationType: { value: '', error: ''},
        date: { value: new Date().toLocaleDateString() },
        time: { value: new Date().toLocaleTimeString() },
        dateHappened: { value: null, error: '' },
        timeHappened: { value: null, error: '' },
        files: [],
    });
    
    const updateBreachData = (field, value) => {
        setBreachData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const cleanBreachData = () => {
        setBreachData({
            safetyCategory: { value: 'Matkustajaturvallisuus', error: '' },
            incidentType: { value: '', error: '' },
            eventLocation: { value: '', error: '' },
            disturbanceOccured: { value: '', error: '' },
            locationDetails: { value: '', error: '' },
            hasToolsInPossession: { value: '', error: '' },
            externalHelp: { value: {
                guard: false,
                police: false,
                firstAid: false,
            }, error: '' },
            passengerTrainCode: { value: '', error: '' },
            commuterTrainCode: { value: '', error: '' },
            injuryType: { value: '', error: '' },
            trafficSituation: { value: '', error: '' },
            passengerAction: { value: '', error: '' },
            doorJam: { value: '', error: '' },
            platformFall: { value: '', error: '' },
            violenceType: { value: '', error: '' },
            location: { value: '', error: '' },
            locationDetail: { value: '', error: '' },
            hasToolsUsed: { value: '', error: '' },
            damageType: { value: '', error: '' },
            propertyDamageLocation: { value: '', error: '' },
            equipmentID: { value: '', error: '' },
            localTrainID: { value: '', error: '' },
            passengerTrainID: { value: '', error: '' },
            option2Value: { value: '', error: '' },
            owner: { value: '', error: '' },
            eventType: { value: '', error: '' },
            safetyDeviceElement: { value: '', error: '' },
            identifier: { value: '', error: '' },
            unitIdentifier: { value: '', error: '' },
            equipmentType: { value: '', error: '' },
            equipmentIdentifier: { value: '', error: '' },
            option21Value: { value: '', error: '' },
            trafficMode: { value: '', error: '' },
            routeId: { value: '', error: '' },
            stopId: { value: '', error: '' },
            option3Value: { value: '', error: '' },
            deviationType: { value: '', error: ''},
            substanceName: { value: '', error: '' },
            ykNumber: { value: '', error: '' },
            isNearMissSituation: {value: false, error: ''},
            substanceAmountEstimate: { value: '', error: '' },
            substanceTarget: { value: {
                soilOrWater: false,
                air: false,
                sewage: false,
            }, error: '' },
            landOwner: { value: '', error: '' },
            trafficType: { value: '', error: '' },
            vehicleType: { value: '', error: '' },
            vehicleSeries: { value: '', error: '' },
            vehicleNumber: { value: '', error: '' },
            influence: { value: '', error: '' },
            firstAidGiven: { value: '', error: '' },
            emergencyServicesRequired: { value: '', error: '' },
            evenNature: { value: '', error: '' },
            city: { value: '', error: '' },
            streetAddress: { value: '', error: '' },
            plCarRegistration: { value: '', error: '' },
            plkNumber: { value: '', error: '' },
            opponentRegistration: { value: '', error: '' },
            detailedEventLocation: { value: '', error: '' },
            option9Value: { value: '', error: '' },
            securityNotification: { value: '', error: '' },
            personType: { value: 'vr', error: '' },
            personName: { value: '', error: '' },
            companyName: { value: '', error: '' },
            description: { value: '', error: '' },
            measure: { value: '', error: '' },
            reason: { value: '', error: '' },
            eventNature: { value: '', error: '' },
            
            date: { value: new Date().toLocaleDateString() },
            time: { value: new Date().toLocaleTimeString() },
            files: [],
            dateHappened: { value: null, error: '' },
            timeHappened: { value: null, error: '' },
        });
    }

    return (
        <ReportContext.Provider value={{
            reportData,
            updateReportData,
            addFile,
            removeFile,
            clearReportData,
            reportDangerData,
            updateReportDangerData,
            cleanReportDangerData,
            breachData,
            updateBreachData,
            cleanBreachData,
        }}>
            {children}
        </ReportContext.Provider>
    );
}; 