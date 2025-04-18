const event_data = [
    {
        id: 1,
        name: "TestCase Oy",
        sortNo: 1,
        parentId: 0,
        children: [
            {
                id: 2,
                name: "Hallinto",
                sortNo: 1,
                parentId: 1,
                children: [
                    {
                        id: 11,
                        name: "Yleishallinto",
                        sortNo: 1,
                        parentId: 2
                    },
                    {
                        id: 12,
                        name: "Kiinteistöhuolto",
                        sortNo: 2,
                        parentId: 2
                    },
                    {
                        id: 13,
                        name: "LVI- ja konehuolto",
                        sortNo: 3,
                        parentId: 2
                    },
                    {
                        id: 14,
                        name: "IT-yksikkö",
                        sortNo: 4,
                        parentId: 2
                    },
                    {
                        id: 15,
                        name: "Kuljetus- ja aluehuolto",
                        sortNo: 5,
                        parentId: 2
                    },
                    {
                        id: 16,
                        name: "Asiakirja-arkisto",
                        sortNo: 5,
                        parentId: 2
                    },
                    {
                        id: 17,
                        name: "Puhdistuspalvelut",
                        sortNo: 5,
                        parentId: 2
                    },

                ]
            },
            {
                id: 3,
                name: "Tuotantolinja B",
                sortNo: 2,
                parentId: 1,
                children: [
                    {
                        id: 18,
                        name: "Niputtamo",
                        sortNo: 1,
                        parentId: 3
                    },
                    {
                        id: 19,
                        name: "Koneistamo",
                        sortNo: 2,
                        parentId: 3
                    },
                    {
                        id: 20,
                        name: "Kenttä",
                        sortNo: 3,
                        parentId: 3
                    },
                    {
                        id: 21,
                        name: "Valvomo",
                        sortNo: 4,
                        parentId: 3
                    },
                ]
            },
            {
                id: 4,
                name: "Myynti pohjoinen",
                sortNo: 3,
                parentId: 1,
                children: [
                    {
                        id: 22,
                        name: "Myyntitiimi Kajaani",
                        sortNo: 1,
                        parentId: 4
                    },
                    {
                        id: 23,
                        name: "Myyntitiimi Oulu",
                        sortNo: 1,
                        parentId: 4
                    }
                ]
            },
            {
                id: 5,
                name: "Myynti pohjoinen A",
                sortNo: 4,
                parentId: 1,
                children: [
                    {
                        id: 24,
                        name: "Niputtamo",
                        sortNo: 1,
                        parentId: 5
                    },
                    {
                        id: 25,
                        name: "Koneistamo",
                        sortNo: 1,
                        parentId: 5
                    },
                    {
                        id: 26,
                        name: "Kenttä",
                        sortNo: 1,
                        parentId: 5
                    },
                    {
                        id: 27,
                        name: "Valvomo",
                        sortNo: 1,
                        parentId: 5
                    },
                ]
            },
            {
                id: 6,
                name: "Myynti pohjoinen B",
                sortNo: 5,
                parentId: 1,
                children: [
                    {
                        id: 28,
                        name: "Niputtamo",
                        sortNo: 1,
                        parentId: 6
                    },
                    {
                        id: 29,
                        name: "Koneistamo",
                        sortNo: 1,
                        parentId: 6
                    },
                    {
                        id: 30,
                        name: "Kenttä",
                        sortNo: 1,
                        parentId: 6
                    },
                    {
                        id: 31,
                        name: "Valvomo",
                        sortNo: 1,
                        parentId: 6
                    },
                ]
            },
            {
                id: 7,
                name: "Myynti Tuotantolinja C",
                sortNo: 6,
                parentId: 1,
                children: [
                    {
                        id: 32,
                        name: "LVI-tiimi",
                        sortNo: 1,
                        parentId: 7
                    },
                    {
                        id: 33,
                        name: "Sähkötiimi",
                        sortNo: 1,
                        parentId: 7
                    },
                ]
            },
            {
                id: 8,
                name: "Myynti Tuotantolinja D",
                sortNo: 7,
                parentId: 1,
                children: [
                    {
                        id: 34,
                        name: "IT-yksikkö",
                        sortNo: 4,
                        parentId: 8
                    },
                    {
                        id: 35,
                        name: "Kuljetus- ja aluehuolto",
                        sortNo: 5,
                        parentId: 8
                    },
                ]
            },
            {
                id: 9,
                name: "Kunnossapito",
                sortNo: 8,
                parentId: 1,
                children: [
                    {
                        id: 36,
                        name: "Herttoniemen paloasema",
                        sortNo: 1,
                        parentId: 9
                    },
                    {
                        id: 37,
                        name: "Malmin paloasema",
                        sortNo: 1,
                        parentId: 9
                    },
                    {
                        id: 38,
                        name: "Suomenlinnan paloasema",
                        sortNo: 1,
                        parentId: 9
                    },
                ]
            },
            {
                id: 10,
                name: "Pelastuslaitos",
                sortNo: 9,
                parentId: 1,
                children: [
                    {
                        id: 39,
                        name: "Operations",
                        sortNo: 1,
                        parentId: 10
                    },
                    {
                        id: 40,
                        name: "Maintainance",
                        sortNo: 1,
                        parentId: 10
                    },
                    {
                        id: 41,
                        name: "Company tounato",
                        sortNo: 1,
                        parentId: 10
                    },
                ]
            },
            
        ]
    }
];

export default event_data;