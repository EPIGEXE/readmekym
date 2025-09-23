import type { DetailedDeveloperData } from '../types/detailTypes'

export const detailedDeveloperData: DetailedDeveloperData = {
    experiences: [
        {
            id: 'exp-1',
            type: 'experience',
            itemType: 'experience',
            title: 'Siemens Solution Engineer',
            subtitle: 'SCOP',
            shortDescription: 'PLM 솔루션 엔지니어',
            fullDescription: '글로벌 제조업체를 대상으로 한 Siemens PLM(Product Lifecycle Management) 솔루션 구축 및 고도화 프로젝트를 담당했습니다. Teamcenter를 중심으로 한 PLM 시스템 컨설팅, 구축, 커스터마이징 업무를 수행하며 제조업의 디지털 트랜스포메이션을 지원했습니다.',
            startYear: 2021,
            endYear: 2023,
            startMonth: 9,
            endMonth: 12,
            company: {
                name: 'SCOP',
                industry: 'IT 솔루션',
                size: '중소기업',
            },
            position: {
                title: 'Solution Engineer',
                level: '신입',
                department: 'PLM 프로젝트팀'
            },
            responsibilities: [
                'Siemens Teamcenter PLM 시스템 구축 및 커스터마이징',
                '제조업체 대상 PLM 컨설팅 및 요구사항 분석',
                'BOM(Bill of Materials) 관리 시스템 설계 및 구현',
                '제품 사양 관리 시스템 개발',
                '클라이언트 교육 및 기술 지원',
                'PLM 시스템 성능 최적화 및 유지보수'
            ],
            achievements: [
                '치과의료기기 제조업체 A사 PLM 시스템 성공적 구축 (6개월)',
                '바이오 의약품 제조업체 B사 BOM 시스템 구축',
                'Teamcenter 커스터마이징을 통한 고객 맞춤형 솔루션 제공',
                '프로젝트 납기 준수율 100% 달성'
            ],
            skills: [
                {
                    id: 'teamcenter',
                    name: 'Siemens Teamcenter',
                    category: 'other',
                    usage: 'PLM 시스템 구축, 워크플로우 설계, 데이터 모델링',
                    experience: 'advanced'
                },
                {
                    id: 'plm-consulting',
                    name: 'PLM Consulting',
                    category: 'other',
                    usage: '고객 요구사항 분석, 비즈니스 프로세스 설계',
                    experience: 'intermediate'
                },
                {
                    id: 'bom-management',
                    name: 'BOM Management',
                    category: 'other',
                    usage: '제품 구조 관리, 부품 정보 체계화',
                    experience: 'advanced'
                }
            ],
            projects: ['proj-1', 'proj-2'],
            retrospective: {
                whatWentWell: [
                    '복잡한 제조업 프로세스를 이해하고 PLM 시스템으로 체계화하는 능력 습득',
                    '고객과의 원활한 커뮤니케이션을 통한 요구사항 명확화',
                    'Teamcenter 전문성을 바탕으로 한 기술적 문제 해결'
                ],
                whatCouldBeImproved: [
                    '프로젝트 초기 단계에서의 리스크 관리 강화 필요',
                    '새로운 기술 트렌드에 대한 지속적인 학습 부족'
                ],
                lessonsLearned: [
                    '제조업 도메인 지식의 중요성 인식',
                    '고객 중심적 사고의 필요성',
                    '기술적 전문성과 비즈니스 이해의 균형'
                ],
                careerGrowth: [
                    'PLM 도메인 전문가로서의 기반 구축',
                    '대기업 고객 대응 경험을 통한 전문성 향상',
                    '프로젝트 관리 및 팀 협업 능력 개발'
                ]
            }
        },
        {
            id: 'exp-2',
            type: 'experience',
            itemType: 'experience',
            title: 'Web Developer',
            subtitle: 'CATIS',
            shortDescription: '웹 개발 및 솔루션 개발',
            fullDescription: '보안 솔루션 전문 기업에서 출입통제 시스템 및 보안 관련 웹 애플리케이션 개발을 담당했습니다. .NET, Spring Boot, React 등 다양한 기술 스택을 활용하여 정부 및 공공기관 대상 보안 솔루션을 개발하고 유지보수했습니다.',
            startYear: 2024,
            endYear: 2025,
            startMonth: 1,
            endMonth: 9,
            company: {
                name: 'CATIS',
                industry: '보안 솔루션',
                size: '중소기업',
                website: 'https://www.catis.co.kr/'
            },
            position: {
                title: 'Web Developer',
                level: '경력 2년차',
                department: 'R&D Center'
            },
            responsibilities: [
                '출입통제 시스템 웹 애플리케이션 개발',
                '정부 및 공공기관 맞춤형 보안 솔루션 개발',
                'SNMP 프로토콜 기반 네트워크 장비 연동 시스템 구축',
                '기존 시스템 유지보수 및 성능 개선',
                'React 기반 모던 웹 프론트엔드 개발',
                'Spring Boot 기반 백엔드 API 개발'
            ],
            achievements: [
                '국가 시설 C 출입통제 시스템 성공적 구축 및 운영',
                'React 도입을 통한 사용자 경험 개선 및 개발 효율성 향상',
                'SNMP 인터페이스 서버 개발로 네트워크 장비 연동 자동화',
                '레거시 시스템 모던화를 통한 유지보수성 개선'
            ],
            skills: [
                {
                    id: 'react',
                    name: 'React',
                    category: 'frontend',
                    usage: 'SPA 개발, 컴포넌트 설계, 상태 관리',
                    experience: 'advanced'
                },
                {
                    id: 'spring-boot',
                    name: 'Spring Boot',
                    category: 'backend',
                    usage: 'REST API 개발, 데이터베이스 연동, 보안 구현',
                    experience: 'intermediate'
                },
                {
                    id: 'csharp',
                    name: 'C#',
                    category: 'backend',
                    usage: '레거시 시스템 유지보수, Windows 서비스 개발',
                    experience: 'intermediate'
                },
                {
                    id: 'tailwind',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '빠른 UI 개발, 반응형 디자인',
                    experience: 'advanced'
                }
            ],
            projects: ['proj-3', 'proj-4', 'proj-5', 'proj-6'],
            retrospective: {
                whatWentWell: [
                    '다양한 기술 스택 경험을 통한 풀스택 개발 역량 강화',
                    '정부 프로젝트 경험을 통한 높은 품질의 코드 작성 능력 습득',
                    'React 생태계에 대한 깊은 이해와 모던 프론트엔드 개발 경험'
                ],
                whatCouldBeImproved: [
                    '테스트 코드 작성 및 CI/CD 파이프라인 구축 경험 부족',
                    '대용량 데이터 처리 및 성능 최적화 경험 부족'
                ],
                lessonsLearned: [
                    '보안 요구사항의 중요성과 구현 방법',
                    '정부 프로젝트의 엄격한 품질 기준',
                    '팀 협업의 가치치'
                ],
                careerGrowth: [
                    'PLM에서 웹 개발로의 성공적인 커리어 전환',
                    '모던 웹 기술 스택에 대한 전문성 확보',
                    '풀스택 개발자로 나아가기 위한 역량 구축'
                ]
            }
        }
    ],
    projects: [
        {
            id: 'proj-1',
            type: 'project',
            itemType: 'project',
            title: '제조 회사 A사 PLM 업그레이드',
            shortDescription: '치과의료 기기 제조 회사 A사 PLM 시스템 업그레이드 프로젝트',
            fullDescription: '치과의료기기 제조업체의 기존 PLM 시스템을 Siemens Teamcenter 최신 버전으로 업그레이드하고, 제품 사양관리 모듈을 새롭게 구축한 프로젝트입니다. 기존 데이터 마이그레이션부터 새로운 워크플로우 구축까지 전 과정을 담당했습니다.',
            startYear: 2021,
            endYear: 2022,
            startMonth: 9,
            endMonth: 3,
            experienceId: 'exp-1',
            teamSize: 4,
            role: 'PLM 엔지니어 (사양관리 모듈 담당)',
            skills: [
                {
                    id: 'teamcenter-upgrade',
                    name: 'Siemens Teamcenter',
                    category: 'other',
                    usage: '시스템 업그레이드, 데이터 마이그레이션, 워크플로우 설계',
                    experience: 'advanced'
                },
                {
                    id: 'specification-management',
                    name: 'Teamcenter 사양관리',
                    category: 'other',
                    usage: '제품 사양 데이터 모델링, 사양서 템플릿 구성',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '기존 시스템 분석 및 요구사항 정의',
                    description: '고객의 기존 PLM 시스템과 비즈니스 프로세스를 분석하여 업그레이드 요구사항을 명확히 정의했습니다.',
                    challenges: '복잡한 제조 프로세스와 다양한 제품군에 대한 이해 부족',
                    solution: '현업 담당자와의 지속적인 미팅을 통해 도메인 지식 습득'
                },
                {
                    id: 'impl-2',
                    title: 'Teamcenter 업그레이드 및 커스터마이징',
                    description: 'Teamcenter 11.6에서 12.4로 업그레이드하고, 고객 요구사항에 맞는 커스터마이징을 수행했습니다.',
                    challenges: '버전 호환성 문제와 기존 커스터마이징 코드 마이그레이션',
                    solution: 'Siemens 기술 지원팀과 협력하여 단계적 마이그레이션 진행'
                },
                {
                    id: 'impl-3',
                    title: '사양관리 모듈 구축',
                    description: '치과의료기기 특성에 맞는 사양관리 모듈을 새롭게 구축했습니다.',
                    challenges: '의료기기 규정 준수와 복잡한 사양 데이터 구조화',
                    solution: '의료기기 전문가와 협업하여 규정 준수 체계 구축'
                }
            ],
            challenges: [
                '의료기기 산업 특성과 규제 요구사항 이해',
                '기존 데이터의 품질 문제 해결',
                '사용자 교육 및 변화 관리'
            ],
            achievements: [
                '6개월 만에 성공적인 시스템 업그레이드 완료',
                '사양관리 효율성 60% 향상',
            ],
            retrospective: {
                whatWentWell: [
                    '체계적인 프로젝트 관리와 단계적 접근',
                    '고객과의 밀접한 소통을 통한 요구사항 명확화',
                    'Teamcenter 전문 지식을 활용한 효과적인 솔루션 제공'
                ],
                whatCouldBeImproved: [
                    '초기 리스크 분석과 대응 계획 수립 미흡',
                    '사용자 교육 프로그램의 체계성 부족'
                ],
                lessonsLearned: [
                    '도메인 전문성의 중요성 인식',
                    '변화 관리의 중요성과 사용자 관점의 필요성',
                    '프로젝트 성공을 위한 이해관계자 관리의 중요성'
                ]
            }
        },
        {
            id: 'proj-2',
            type: 'project',
            itemType: 'project',
            title: '제약 회사 B사 BOM 프로젝트',
            shortDescription: '바이오 의약품 제조 회사 B사 BOM 시스템 구축 프로젝트',
            fullDescription: '바이오 의약품 제조업체의 복잡한 제품 구조를 체계적으로 관리하기 위한 BOM(Bill of Materials) 시스템을 새롭게 구축한 프로젝트입니다. Teamcenter 기반으로 제품 구조, 부품 정보, 승인 워크플로우까지 포함한 통합 관리 시스템을 개발했습니다.',
            startYear: 2022,
            endYear: 2023,
            startMonth: 6,
            endMonth: 2,
            experienceId: 'exp-1',
            teamSize: 3,
            role: 'BOM 시스템 개발 담당',
            skills: [
                {
                    id: 'teamcenter-bom',
                    name: 'Siemens Teamcenter',
                    category: 'other',
                    usage: 'BOM 구조 설계, 제품 데이터 관리, 워크플로우 구성',
                    experience: 'advanced'
                },
                {
                    id: 'bom-management-advanced',
                    name: 'Teamcenter BOM',
                    category: 'other',
                    usage: '복잡한 제품 구조 모델링, 변경 관리 프로세스 구축',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'BOM 구조 분석 및 설계',
                    description: '바이오 의약품의 복잡한 제품 구조를 분석하고, Teamcenter에 적합한 BOM 모델을 설계했습니다.',
                    challenges: '바이오 의약품 특성상 복잡한 제품 구조와 엄격한 규제 요구사항',
                    solution: '제약업계 전문가와 협력하여 규제 준수 BOM 구조 설계'
                },
                {
                    id: 'impl-2',
                    title: '승인 워크플로우 구축',
                    description: 'BOM 변경에 대한 승인 프로세스를 회사 내부 승인 프로그램과 연동하여 체계적인 변경 관리 시스템을 구축',
                    challenges: '복잡한 승인 단계와 이해관계자 관리',
                    solution: '단계별 권한 관리 구축과 이해관계자 관리 연동'
                }
            ],
            challenges: [
                '제약업계 규제 요구사항 준수',
                '복잡한 제품 구조의 체계적 관리',
                '다양한 부서 간 협업 프로세스 구축'
            ],
            achievements: [
                '제품 변경 추적 시스템 구축으로 규제 대응 강화',
                '사용자 교육 완료율 100% 달성'
            ],
            retrospective: {
                whatWentWell: [
                    '제약업계 도메인 지식 습득과 적용',
                    '복잡한 승인 프로세스 설계 연동',
                ],
                whatCouldBeImproved: [
                    '초기 요구사항 분석 단계에서 더 세밀한 업무 프로세스 파악 필요',
                    '사용자 교육 및 변화 관리 전략 수립 미흡'
                ],
                lessonsLearned: [
                    '규제가 엄격한 업계에서의 시스템 구축 방법',
                    '복잡한 비즈니스 프로세스의 시스템화 중요성',
                    '사용자 피드백의 가치와 반영 방법'
                ]
            }
        },
        {
            id: 'proj-3',
            type: 'project',
            itemType: 'project',
            title: 'Catis 출입통제 프로그램 Axilog 개선',
            shortDescription: 'CATIS 출입통제 프로그램 Axilog 개선 및 유지보수',
            fullDescription: 'CATIS의 기존 출입통제 프로그램인 Axilog의 성능 개선과 새로운 기능 추가를 담당했습니다. C#과 .NET Framework 기반의 레거시 시스템을 분석하고, 사용자 요구사항에 맞는 개선사항을 구현했습니다.',
            startYear: 2024,
            endYear: 2024,
            startMonth: 1,
            endMonth: 3,
            experienceId: 'exp-2',
            teamSize: 2,
            role: '백엔드 개발 및 시스템 개선 담당',
            skills: [
                {
                    id: 'csharp-axilog',
                    name: 'C#',
                    category: 'backend',
                    usage: '레거시 코드 분석, 기능 개선, 버그 수정',
                    experience: 'intermediate'
                },
                {
                    id: 'dotnet-axilog',
                    name: '.NET',
                    category: 'backend',
                    usage: 'Windows Forms 애플리케이션 개발, 데이터베이스 연동',
                    experience: 'intermediate'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '레거시 코드 분석 및 리팩토링',
                    description: '기존 Axilog 시스템의 코드를 분석하고, 성능 개선을 위한 리팩토링을 수행했습니다.',
                    challenges: '문서화가 부족한 레거시 코드의 이해 어려움',
                    solution: '단계적 코드 분석과 기능 단위 테스트를 통한 점진적 개선'
                },
                {
                    id: 'impl-2',
                    title: '사용자 인터페이스 개선',
                    description: '사용자 피드백을 바탕으로 더 직관적이고 효율적인 UI로 개선했습니다.',
                    challenges: 'Windows Forms의 한계와 사용자 다양한 요구사항',
                    solution: '사용자 인터뷰를 통한 우선순위 정리와 단계적 개선'
                }
            ],
            challenges: [
                '레거시 시스템의 복잡성과 기술 부채',
                '기존 사용자들의 변화 저항',
                '제한된 개발 리소스와 일정'
            ],
            achievements: [
                '버그 발생률 60% 감소',
                '신규 기능 7개 추가 구현'
            ],
            retrospective: {
                whatWentWell: [
                    '레거시 시스템에 대한 이해도 향상',
                    '사용자 중심적 개선 접근 방식',
                    'C# 개발 역량 강화'
                ],
                whatCouldBeImproved: [
                    '코드 문서화 작업 병행 필요',
                    '자동화된 테스트 구축 부족'
                ],
                lessonsLearned: [
                    '레거시 시스템 개선의 어려움과 접근 방법',
                    '사용자 피드백의 중요성',
                    '점진적 개선의 효과'
                ]
            }
        },
        {
            id: 'proj-4',
            type: 'project',
            itemType: 'project',
            title: '화물검색 이력관리 프로그램 개선',
            shortDescription: '국가 시설 C 납품용 X-ray 화물검색 이력관리 프로그램 개선',
            fullDescription: '국가 시설에 납품할 X-ray 화물검색 이력관리 프로그램의 화면 개선 프로젝트입니다. 외주업체에서 Spring Boot와 Thymeleaf로 개발한 기존 시스템이 고객 요구사항을 충족하지 못하는 화면 표시 문제가 있어, 사용자 인터페이스를 전면 재구축하고 Spring Scheduler를 활용한 데이터 백업 기능을 추가했습니다.',
            startYear: 2024,
            endYear: 2024,
            startMonth: 4,
            endMonth: 6,
            experienceId: 'exp-2',
            teamSize: 3,
            role: '프론트엔드 화면 재구축 및 백업 시스템 개발',
            skills: [
                {
                    id: 'springboot-cargo',
                    name: 'Spring Boot',
                    category: 'backend',
                    usage: '기존 백엔드 로직 분석, API 활용',
                    experience: 'intermediate'
                },
                {
                    id: 'thymeleaf-cargo',
                    name: 'Thymeleaf',
                    category: 'frontend',
                    usage: '사용자 인터페이스 재구축, 동적 화면 구현',
                    experience: 'intermediate'
                },
                {
                    id: 'spring-scheduler',
                    name: 'Spring Scheduler',
                    category: 'backend',
                    usage: '주기적 데이터 백업, 배치 작업 자동화',
                    experience: 'beginner'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '사용자 인터페이스 전면 재구축',
                    description: '고객 요구사항을 충족하지 못하는 기존 화면을 Thymeleaf 기반으로 완전히 재설계했습니다.',
                    challenges: '기존 Spring Boot 백엔드 로직은 유지하면서 화면만 새로 구성해야 하는 제약',
                    solution: '기존 API를 활용하되 사용자 경험을 고려한 직관적인 UI/UX로 재설계'
                },
                {
                    id: 'impl-2',
                    title: 'Spring Scheduler 기반 데이터 백업 시스템',
                    description: '카드 데이터 데이터베이스를 주기적으로 백업하는 시스템을 구축했습니다.',
                    challenges: '카드 데이터 백업 시스템 구축',
                    solution: 'Spring @Scheduled 어노테이션을 활용한 백업 구현'
                },
                {
                    id: 'impl-3',
                    title: '화물 이력 표시 화면 개선',
                    description: '화물 태깅 위치, X-ray 이미지, 검색 결과를 한눈에 볼 수 있는 통합 화면을 구현했습니다.',
                    challenges: '복잡한 검색 이력 데이터를 사용자가 이해하기 쉽게 표현',
                    solution: '시각적 매핑과 시간순 정렬을 통한 직관적인 이력 추적 화면 구성'
                }
            ],
            challenges: [
                '외주업체 개발 시스템의 요구사항 미충족 화면 분석',
                '기존 Spring Boot 백엔드 로직 유지하면서 화면만 재구축',
                '복잡한 화물 검색 이력 데이터의 직관적 표현',
            ],
            achievements: [
                'UI 재구축 완료',
                'Spring Scheduler 기반 자동 백업 시스템 구축',
            ],
            retrospective: {
                whatWentWell: [
                    'Spring Boot 생태계에 대한 이해 습득',
                    '정부 프로젝트 요구사항 대응 능력 향상',
                    '성능 최적화 경험 축적'
                ],
                whatCouldBeImproved: [
                    '프론트엔드 기술 스택 현대화 필요',
                ],
                lessonsLearned: [
                    '정부 프로젝트의 특수한 요구사항과 절차',
                    '레거시 시스템 현대화 전략'
                ]
            }
        },
        {
            id: 'proj-5',
            type: 'project',
            itemType: 'project',
            title: '국가 시설 C 출입통제 개선 프로젝트',
            shortDescription: '국가 시설 C 출입통제 시스템 SNMP 인터페이스 서버 개발',
            fullDescription: '국가 시설의 출입통제 시스템을 Spring Cloud 기반 마이크로서비스로 구축하는 프로젝트에서 SNMP 인터페이스 서버를 담당했습니다. 각 네트워크 장비에 정해진 OID로 SNMP 호출을 보내 장비 상태 및 허브 포트 상태를 확인하는 마이크로서비스를 개발했습니다.',
            startYear: 2024,
            endYear: 2024,
            startMonth: 7,
            endMonth: 11,
            experienceId: 'exp-2',
            teamSize: 4,
            role: 'SNMP 인터페이스 서버 개발 (마이크로서비스)',
            skills: [
                {
                    id: 'springboot-snmp',
                    name: 'Spring Boot',
                    category: 'backend',
                    usage: 'SNMP 인터페이스 마이크로서비스 개발, REST API 구현',
                    experience: 'intermediate'
                },
                {
                    id: 'snmp-protocol',
                    name: 'SNMP',
                    category: 'other',
                    usage: 'OID 기반 장비 상태 조회, 허브 포트 모니터링',
                    experience: 'intermediate'
                },
                {
                    id: 'spring-cloud',
                    name: 'Spring Cloud',
                    category: 'backend',
                    usage: '마이크로서비스 아키텍처, 서비스 간 통신',
                    experience: 'beginner'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'OID 기반 SNMP 장비 상태 조회 서비스',
                    description: '각 네트워크 장비에 정해진 OID로 SNMP GET 요청을 보내 장비가 살아있는지 확인하는 서비스를 개발했습니다.',
                    challenges: 'SNMP OID 체계 이해와 다양한 장비별 응답 처리',
                    solution: 'SNMP4J 라이브러리 활용'
                },
                {
                    id: 'impl-2',
                    title: '허브 포트 상태 모니터링 시스템',
                    description: '허브 장비의 각 포트 상태를 SNMP로 조회하여 포트 연결 상태를 확인하는 시스템을 구축했습니다.',
                    challenges: '대상 허브별 상이한 포트 상태 OID와 응답 값 해석',
                    solution: '장비 제조사별 MIB 분석과 표준화된 응답 처리를 통해 포트 상태 모니터링 시스템 구축'
                }
            ],
            challenges: [
                'SNMP OID 체계와 MIB 구조 이해',
                '다양한 장비 제조사별 SNMP 응답 차이 처리',
                '실시간 장비 상태 모니터링 성능 최적화'
            ],
            achievements: [
                'SNMP 기반 장비 상태 모니터링 마이크로서비스 구축',
                '허브 포트 상태 실시간 조회 시스템 완성',
                '장비 장애 감지 시간 대폭 단축'
            ],
            retrospective: {
                whatWentWell: [
                    'SNMP 프로토콜과 네트워크 장비 모니터링 전문성 습득',
                    '다양한 장비 제조사별 호환성 문제 해결 능력 향상'
                ],
                whatCouldBeImproved: [
                    'MIB 구조에 대한 더 깊은 이해 필요',
                    '장비 장애 상황에 대한 예외 처리 강화'
                ],
                lessonsLearned: [
                    'SNMP 프로토콜의 실무 적용과 한계',
                    '마이크로서비스 간 통신의 복잡성',
                    '네트워크 장비 모니터링의 중요성과 구현 방법'
                ]
            }
        },
        {
            id: 'proj-6',
            type: 'project',
            itemType: 'project',
            title: '국가 시설 C 통합 출입통제 개발 프로그램',
            shortDescription: '국가 시설 C 통합 출입통제 시스템 WebSocket 및 도면 기반 경보 화면 개발',
            fullDescription: '국가 시설의 통합 출입통제 시스템에서 WebSocket을 통한 생체인식 장치 실시간 모니터링, 장치 제어 인터페이스, 그리고 Konva 라이브러리를 활용한 도면 기반 경보 시스템을 개발했습니다. 지문인식 장치 등의 생체인식 장비 상태를 실시간으로 받아 처리하고, 도면 위에 문 객체를 배치하여 경보 발생 시 시각적 표시와 경보음을 제공하는 시스템을 구축했습니다.',
            startYear: 2025,
            endYear: 2025,
            startMonth: 1,
            endMonth: 9,
            experienceId: 'exp-2',
            teamSize: 5,
            role: 'WebSocket 통신 및 도면 기반 UI 개발',
            skills: [
                {
                    id: 'react-integrated',
                    name: 'React',
                    category: 'frontend',
                    usage: '실시간 데이터 처리 컴포넌트, 장치 제어 UI 구현',
                    experience: 'advanced'
                },
                {
                    id: 'websocket-client',
                    name: 'WebSocket',
                    category: 'frontend',
                    usage: '생체인식 장치 실시간 상태 수신, 장비 이벤트 처리',
                    experience: 'intermediate'
                },
                {
                    id: 'konva-canvas',
                    name: 'Konva.js',
                    category: 'frontend',
                    usage: '도면 기반 인터페이스, 문 객체 배치, 경보 시각화',
                    experience: 'intermediate'
                },
                {
                    id: 'tailwind-integrated',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '장치 제어 패널 UI, 경보 화면 스타일링',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'WebSocket 기반 생체인식 장치 모니터링',
                    description: '지문인식 장치 등 생체인식 장비의 상태를 WebSocket으로 실시간 수신하여 처리하는 시스템을 구현했습니다.',
                    challenges: '다양한 생체인식 장치의 상이한 데이터 포맷과 실시간 처리',
                    solution: 'WebSocket 연결 관리와 장치별 데이터 파싱 로직 구현'
                },
                {
                    id: 'impl-2',
                    title: 'Konva 기반 도면 경보 시스템',
                    description: 'Konva 라이브러리를 활용하여 도면 위에 문 객체를 배치하고, 경보 발생 시 시각적 표시와 경보음을 제공하는 시스템을 구현했습니다.',
                    challenges: '복잡한 도면 데이터의 인터랙티브 렌더링과 실시간 경보 표시',
                    solution: 'Canvas 기반 도면 렌더링과 오디오 API를 활용한 경보 시스템 구축'
                }
            ],
            challenges: [
                'WebSocket 연결 안정성과 재연결 메커니즘 구현',
                'Konva를 활용한 복잡한 도면 렌더링 최적화',
                '실시간 경보 처리와 오디오 재생 동기화'
            ],
            achievements: [
                'WebSocket 기반 실시간 장치 모니터링 시스템 구축',
                'Konva 라이브러리를 활용한 도면 기반 경보 시스템 완성',
                '경보 발생 시 시각적/청각적 알림 시스템 구축',
                '사용자 친화적인 통합 관리 화면 제공'
            ],
            retrospective: {
                whatWentWell: [
                    'WebSocket을 활용한 실시간 통신 기술 습득',
                    'Konva 라이브러리를 통한 Canvas 기반 UI 개발 경험',
                ],
                whatCouldBeImproved: [
                    'WebSocket 연결 장애 상황에 대한 더 견고한 처리 필요',
                    'cavas 렌더링 성능 최적화 개선 여지'
                ],
                lessonsLearned: [
                    '실시간 통신의 복잡성과 안정성 확보 방법',
                    'Canvas 기반 인터페이스 개발의 장점과 한계',
                ]
            }
        },
        {
            id: 'proj-7',
            type: 'project',
            itemType: 'project',
            title: '온실가스 차트 웹페이지',
            shortDescription: '한국 온실가스 배출량 데이터 시각화 웹페이지',
            fullDescription: '친구의 아이디어로 시작한 개인 프로젝트로, 한국의 온실가스 배출량 데이터를 시각화하는 웹페이지를 제작했습니다. 웹 개발 연습을 목적으로 React, Chart.js, shadcn/ui를 활용하여 깔끔하고 직관적인 데이터 시각화 인터페이스를 구현했습니다.',
            startYear: 2024,
            endYear: 2024,
            startMonth: 11,
            endMonth: 11,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/EPIGEXE/greenhouseGasFront',
            SeeMore: 'https://befitting-silica-24b.notion.site/14568d63fcbd805d892ec3cac520690f?pvs=74',
            skills: [
                {
                    id: 'react-chart',
                    name: 'React',
                    category: 'frontend',
                    usage: '컴포넌트 기반 UI 구현, 차트 데이터 상태 관리',
                    experience: 'intermediate'
                },
                {
                    id: 'shadcn-ui',
                    name: 'shadcn/ui',
                    category: 'frontend',
                    usage: '모던한 UI 컴포넌트, 일관된 디자인 시스템',
                    experience: 'beginner'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '한국 온실가스 데이터 수집 및 처리',
                    description: '한국 환경공단 등의 공개 데이터를 활용하여 국내 온실가스 배출량 데이터를 수집하고 차트에 적합한 형태로 가공했습니다.',
                    challenges: '한국 특화 환경 데이터의 포맷 이해와 정제',
                    solution: '한국 데이터 특성에 맞는 파싱 로직과 데이터 구조화'
                },
                {
                    id: 'impl-2',
                    title: 'shadcn/ui 기반 모던 인터페이스 구축',
                    description: 'shadcn/ui 컴포넌트 라이브러리를 활용하여 깔끔하고 일관성 있는 사용자 인터페이스를 구축했습니다.',
                    challenges: 'shadcn/ui 컴포넌트 시스템 학습과 커스터마이징',
                    solution: '공식 문서와 예제를 통한 컴포넌트 활용법 습득'
                }
            ],
            challenges: [
                'shadcn/ui 컴포넌트 시스템 학습과 적용',
                '한국 환경 데이터 특성 이해와 처리',
            ],
            achievements: [
                '친구 아이디어를 바탕으로 한 첫 데이터 시각화 프로젝트 완성',
                'shadcn/ui 컴포넌트 라이브러리 활용 경험 습득',
                '웹 개발 연습 목표 달성'
            ],
            retrospective: {
                whatWentWell: [
                    'shadcn/ui를 통한 모던 UI 컴포넌트 시스템 경험',
                    '친구 아이디어를 실제 구현으로 발전시키는 협업 경험',
                    '한국 특화 데이터를 활용한 의미있는 시각화 완성'
                ],
                whatCouldBeImproved: [
                    '더 다양한 차트 타입과 인터랙션 구현',
                    '데이터 업데이트 자동화 메커니즘 부족'
                ],
                lessonsLearned: [
                    'shadcn/ui의 효율성과 디자인 시스템의 중요성',
                    '데이터 시각화를 통한 정보 전달의 효과',
                    '아이디어 공유와 실행의 가치'
                ]
            }
        },
        {
            id: 'proj-8',
            type: 'project',
            itemType: 'project',
            title: '가계부 프로그램',
            shortDescription: '개인 연습용 데스크탑 가계부 애플리케이션',
            fullDescription: '온실가스 차트 웹사이트보다 더 유용한 프로그램을 만들고 싶어서 시작한 개인 연습 프로젝트입니다. Electron 기반 데스크탑 애플리케이션으로 React와 SQLite를 활용하여 실제로 사용할 수 있는 가계부 프로그램을 개발했습니다. 웹 개발 기술을 데스크탑 환경에 적용해보는 학습 목적도 있었습니다.',
            startYear: 2024,
            endYear: 2025,
            startMonth: 12,
            endMonth: 1,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/EPIGEXE/save_wise',
            SeeMore: 'https://befitting-silica-24b.notion.site/14568d63fcbd80358cedf5082ec66fff?pvs=74',
            skills: [
                {
                    id: 'electron-desktop',
                    name: 'Electron',
                    category: 'frontend',
                    usage: '데스크탑 애플리케이션 구조 설계, 메인/렌더러 프로세스 관리',
                    experience: 'beginner'
                },
                {
                    id: 'react-desktop',
                    name: 'React',
                    category: 'frontend',
                    usage: '가계부 UI 컴포넌트 구현, 상태 관리',
                    experience: 'intermediate'
                },
                {
                    id: 'sqlite-local',
                    name: 'SQLite',
                    category: 'backend',
                    usage: '로컬 데이터베이스 설계, 가계부 데이터 관리',
                    experience: 'beginner'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'Electron 애플리케이션 구조 설계',
                    description: 'Electron의 메인 프로세스와 렌더러 프로세스를 활용한 데스크탑 앱 아키텍처를 설계했습니다.',
                    challenges: 'Electron 생태계와 프로세스 간 통신 이해',
                    solution: '공식 문서와 예제를 통한 단계적 학습'
                },
                {
                    id: 'impl-2',
                    title: 'SQLite 데이터베이스 설계',
                    description: '가계부 데이터를 효율적으로 저장하고 조회할 수 있는 SQLite 데이터베이스를 설계했습니다.',
                    challenges: 'SQL 쿼리 최적화와 데이터 무결성 보장',
                    solution: 'SQLite 데이터베이스 설계 및 관리'
                },
                {
                    id: 'impl-3',
                    title: '사용자 친화적 UI/UX 구현',
                    description: '직관적이고 사용하기 쉬운 가계부 인터페이스를 React로 구현했습니다.',
                    challenges: '복잡한 재정 데이터의 간단한 표현',
                    solution: '사용자 시나리오 기반 UI/UX 설계'
                }
            ],
            challenges: [
                'Electron 프레임워크 학습',
                '로컬 데이터베이스 관리',
                '크로스 플랫폼 호환성 확보',
            ],
            achievements: [
                '실제 사용 가능한 유용한 프로그램 연습습',
                'Electron을 통한 웹 기술의 데스크탑 확장 경험',
                'SQLite 데이터베이스 설계 및 관리 능력 향상',
                '개인 연습 프로젝트로서의 학습 목표 달성'
            ],
            retrospective: {
                whatWentWell: [
                    '이전 프로젝트보다 더 실용적이고 유용한 프로그램 완성',
                    'Electron을 통한 웹 기술의 데스크탑 확장 경험',
                ],
                whatCouldBeImproved: [
                    '사용자 경험(UX) 개선 여지',
                ],
                lessonsLearned: [
                    '연습용 프로젝트도 실용성을 고려하면 더 의미있는 학습 효과',
                    'Electron 생태계와 데스크탑 앱 개발의 특성',
                    '점진적으로 더 복잡하고 유용한 프로젝트에 도전하는 것의 가치'
                ]
            }
        },
        {
            id: 'proj-9',
            type: 'project',
            itemType: 'project',
            title: '온라인 스캠 방지 사이트',
            shortDescription: '스캠 방지 교육 사이트',
            fullDescription: '최근 증가하는 온라인 스캠 피해를 예방하기 위해 개발한 교육용 웹사이트입니다. Next.js와 TypeScript를 활용하여 구축하고, 다양한 스캠 유형과 대응 방법을 시나리오 기반으로 제공합니다.',
            startYear: 2025,
            endYear: 2025,
            startMonth: 7,
            endMonth: 7,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/EPIGEXE/FonziGuard',
            live: 'https://fonzi-detector.thebrothers.dev/ko',
            skills: [
                {
                    id: 'nextjs-ssg',
                    name: 'Next.js',
                    category: 'frontend',
                    usage: 'SEO 최적화, 라우팅',
                    experience: 'intermediate'
                },
                {
                    id: 'typescript-type-safety',
                    name: 'TypeScript',
                    category: 'frontend',
                    usage: '타입 안전성 확보, 코드 품질 향상',
                    experience: 'intermediate'
                },
                {
                    id: 'tailwind-responsive',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '반응형 디자인, 컴포넌트 기반 스타일링',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '스캠 시나리오 기반 교육 콘텐츠 구현',
                    description: '실제 스캠 사례를 바탕으로 한 인터랙티브 교육 콘텐츠를 구현했습니다.',
                    challenges: '복잡한 시나리오의 단순하고 이해하기 쉬운 표현',
                    solution: '단계별 시나리오와 시각적 가이드 제공'
                }
            ],
            challenges: [
                'SEO 최적화와 웹 접근성 확보',
                '다양한 연령층을 고려한 UI/UX'
            ],
            achievements: [
                'Next.js 사이트 완성',
                'TypeScript 활용 능력 향상',
                '사회적 가치 창출 프로젝트 완성',
                'SEO 최적화 경험 습득'
            ],
            retrospective: {
                whatWentWell: [
                    'Next.js 프레임워크에 대한 깊은 이해',
                    'TypeScript 도입을 통한 코드 품질 향상',
                    '사회적 문제 해결을 위한 기술 활용'
                ],
                whatCouldBeImproved: [
                    '사용자 피드백 수집 메커니즘 부족',
                    '콘텐츠 업데이트 자동화 필요'
                ],
                lessonsLearned: [
                    'SSG의 장점과 활용 방법',
                    '교육용 콘텐츠 설계의 중요성',
                    '기술을 통한 사회적 가치 창출'
                ]
            }
        },
        {
            id: 'proj-10',
            type: 'project',
            itemType: 'project',
            title: '다국어 멀티 블로그 포스팅 프로그램',
            shortDescription: 'LLM 자동 번역 및 다중 블로그 플랫폼 포스팅 도구',
            fullDescription: '개발 경험과 지식을 여러 플랫폼에 효율적으로 공유하기 위해 개발한 데스크탑 애플리케이션입니다. LLM API를 활용한 자동 번역 기능과 dev.to, Google Blogger, Qiita 세 개의 블로그 플랫폼 API를 연동하여 다국어 콘텐츠를 동시에 포스팅할 수 있는 도구를 구축했습니다.',
            startYear: 2025,
            endYear: 2025,
            startMonth: 8,
            endMonth: 9,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/EPIGEXE/loudSelf',
            skills: [
                {
                    id: 'electron-advanced',
                    name: 'Electron',
                    category: 'frontend',
                    usage: '복잡한 데스크탑 앱 아키텍처, IPC 통신, 보안 설정',
                    experience: 'intermediate'
                },
                {
                    id: 'react-advanced',
                    name: 'React',
                    category: 'frontend',
                    usage: '복잡한 에디터 UI, 상태 관리, 컴포넌트 최적화',
                    experience: 'advanced'
                },
                {
                    id: 'typescript-advanced',
                    name: 'TypeScript',
                    category: 'frontend',
                    usage: '고급 타입 시스템, 제네릭, 타입 가드 활용',
                    experience: 'intermediate'
                },
                {
                    id: 'tailwind-advanced',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '커스텀 디자인 시스템, 다크모드, 애니메이션',
                    experience: 'advanced'
                },
                {
                    id: 'llm-api',
                    name: 'LLM API',
                    category: 'backend',
                    usage: '다국어 자동 번역, 콘텐츠 처리',
                    experience: 'beginner'
                },
                {
                    id: 'blog-apis',
                    name: 'Blog Platform APIs',
                    category: 'backend',
                    usage: 'dev.to, Google Blogger, Qiita API 연동 및 포스팅',
                    experience: 'intermediate'
                },
                {
                    id: 'typeorm-database',
                    name: 'TypeORM',
                    category: 'backend',
                    usage: '블로그 포스트 데이터 엔티티 설계, 관계 매핑',
                    experience: 'beginner'
                },
                {
                    id: 'sqlite-advanced',
                    name: 'SQLite',
                    category: 'backend',
                    usage: '포스트 메타데이터 저장, 번역 이력 관리',
                    experience: 'intermediate'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'LLM API 기반 자동 번역 시스템',
                    description: 'LLM API를 활용하여 작성한 콘텐츠를 자동으로 다국어로 번역하는 시스템을 구축했습니다.',
                    challenges: 'LLM API 호출 최적화와 번역 품질 관리',
                    solution: 'LLM API 연동과 번역 결과 후처리 로직 구현'
                },
                {
                    id: 'impl-2',
                    title: '다중 블로그 플랫폼 API 연동',
                    description: 'dev.to, Google Blogger, Qiita 세 개 플랫폼의 API를 연동하여 동시 포스팅이 가능한 시스템을 구축했습니다.',
                    challenges: '각 플랫폼별 상이한 API 스펙과 인증 방식 처리',
                    solution: '플랫폼별 어댑터 패턴 적용과 통합 포스팅 인터페이스 구축'
                },
                {
                    id: 'impl-3',
                    title: 'TypeORM 기반 콘텐츠 관리',
                    description: '블로그 포스트, 번역 이력, 플랫폼별 메타데이터를 관리하는 데이터 모델을 설계했습니다.',
                    challenges: '복잡한 다국어 콘텐츠와 플랫폼별 데이터의 효율적 관리',
                    solution: 'TypeORM 엔티티 관계 설계와 데이터 무결성 보장'
                },
                {
                    id: 'impl-4',
                    title: '통합 포스팅 워크플로우 구현',
                    description: '콘텐츠 작성부터 번역, 다중 플랫폼 포스팅까지의 전체 워크플로우를 구현했습니다.',
                    challenges: '비동기 처리와 에러 핸들링, 포스팅 상태 관리',
                    solution: '작업 큐 시스템과 상태 추적 메커니즘 구축'
                }
            ],
            challenges: [
                'LLM API 호출 최적화',
                'dev.to, Google Blogger, Qiita API의 상이한 스펙 통합',
                '자동 번역 품질 보장과 후처리',
                '다중 플랫폼 동시 포스팅 시 에러 핸들링'
            ],
            achievements: [
                'LLM 기반 자동 번역 시스템 구축',
                '3개 주요 블로그 플랫폼 API 연동 완료',
                '다국어 콘텐츠 자동 배포 워크플로우 구현',
                '개인 블로그 운영 효율성 대폭 향상'
            ],
            retrospective: {
                whatWentWell: [
                    'LLM API를 활용한 자동 번역 시스템 성공적 구현',
                    '3개 블로그 플랫폼 API의 효과적인 통합',
                    '실제 블로그 운영 효율성을 크게 개선하는 도구 완성'
                ],
                whatCouldBeImproved: [
                    'LLM API 비용 최적화 전략 필요',
                    '번역 품질 검증 및 수정 기능 부족'
                ],
                lessonsLearned: [
                    'LLM API 활용 시 비용과 품질의 균형점 찾기',
                    '다양한 외부 API 통합 시 에러 처리의 중요성',
                    '자동화 도구가 개인 생산성에 미치는 큰 영향'
                ]
            }
        }
    ]
}