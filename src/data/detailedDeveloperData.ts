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
                website: 'https://www.scop.co.kr'
            },
            position: {
                title: 'Solution Engineer',
                level: '신입',
                department: 'PLM사업부'
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
                '바이오 의약품 제조업체 B사 BOM 시스템 구축으로 업무 효율성 40% 향상',
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
                size: '중소기업'
            },
            position: {
                title: 'Web Developer',
                level: '경력 2년차',
                department: '솔루션개발팀'
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
                    '팀 협업과 코드 리뷰의 가치'
                ],
                careerGrowth: [
                    'PLM에서 웹 개발로의 성공적인 커리어 전환',
                    '모던 웹 기술 스택에 대한 전문성 확보',
                    '풀스택 개발자로서의 역량 구축'
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
            images: [],
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
                '데이터 품질 개선으로 오류 발생률 80% 감소',
                '사용자 만족도 90% 이상 달성'
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
            images: [],
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
                    description: 'BOM 변경에 대한 다단계 승인 프로세스를 Teamcenter 워크플로우로 구현했습니다.',
                    challenges: '복잡한 승인 단계와 다양한 이해관계자 관리',
                    solution: '단계별 권한 관리와 자동 알림 시스템 구축'
                }
            ],
            challenges: [
                '제약업계 규제 요구사항 준수',
                '복잡한 제품 구조의 체계적 관리',
                '다양한 부서 간 협업 프로세스 구축'
            ],
            achievements: [
                'BOM 관리 효율성 50% 향상',
                '제품 변경 추적 시스템 구축으로 규제 대응 강화',
                '부품 정보 정확도 95% 이상 달성',
                '사용자 교육 완료율 100% 달성'
            ],
            retrospective: {
                whatWentWell: [
                    '제약업계 도메인 지식 습득과 적용',
                    '복잡한 워크플로우 설계 및 구현 성공',
                    '사용자 중심의 시스템 설계'
                ],
                whatCouldBeImproved: [
                    '초기 데이터 마이그레이션 계획 수립 미흡',
                    '성능 최적화 고려 부족'
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
            title: 'Axilog 개선',
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
            images: [],
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
                '시스템 응답 속도 30% 향상',
                '사용자 만족도 조사에서 85% 긍정적 평가',
                '버그 발생률 60% 감소',
                '신규 기능 3개 추가 구현'
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
            shortDescription: '국가 시설 C 납품용 화물검색 이력관리 프로그램 개선',
            fullDescription: '국가 시설에 납품할 화물검색 이력관리 프로그램의 성능 개선과 새로운 요구사항 구현을 담당했습니다. Spring Boot와 Thymeleaf를 활용하여 웹 기반 시스템으로 현대화하고, 사용자 경험을 크게 개선했습니다.',
            startYear: 2024,
            endYear: 2024,
            startMonth: 4,
            endMonth: 6,
            experienceId: 'exp-2',
            teamSize: 3,
            role: '백엔드 개발 및 시스템 아키텍처 설계',
            skills: [
                {
                    id: 'springboot-cargo',
                    name: 'Spring Boot',
                    category: 'backend',
                    usage: 'REST API 개발, 보안 구현, 데이터베이스 연동',
                    experience: 'intermediate'
                },
                {
                    id: 'thymeleaf-cargo',
                    name: 'Thymeleaf',
                    category: 'frontend',
                    usage: '서버사이드 렌더링, 동적 UI 구현',
                    experience: 'beginner'
                }
            ],
            images: [],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'Spring Boot 기반 시스템 재구축',
                    description: '기존 레거시 시스템을 Spring Boot 기반으로 재구축하여 성능과 유지보수성을 향상시켰습니다.',
                    challenges: '기존 데이터 구조 유지하면서 새로운 아키텍처로 마이그레이션',
                    solution: '단계적 마이그레이션과 데이터 호환성 보장'
                },
                {
                    id: 'impl-2',
                    title: '화물 검색 알고리즘 최적화',
                    description: '대용량 화물 데이터에서 빠른 검색이 가능하도록 알고리즘을 최적화했습니다.',
                    challenges: '대용량 데이터 처리와 실시간 검색 성능',
                    solution: '인덱싱 최적화와 캐싱 전략 적용'
                }
            ],
            challenges: [
                '정부 보안 요구사항 준수',
                '대용량 데이터 처리 성능 최적화',
                '기존 시스템과의 호환성 유지'
            ],
            achievements: [
                '검색 속도 70% 향상',
                '시스템 안정성 95% 이상 달성',
                '정부 보안 인증 통과',
                '사용자 교육 시간 50% 단축'
            ],
            retrospective: {
                whatWentWell: [
                    'Spring Boot 생태계에 대한 깊은 이해 습득',
                    '정부 프로젝트 요구사항 대응 능력 향상',
                    '성능 최적화 경험 축적'
                ],
                whatCouldBeImproved: [
                    '프론트엔드 기술 스택 현대화 필요',
                    '자동화된 배포 프로세스 구축 부족'
                ],
                lessonsLearned: [
                    '정부 프로젝트의 특수한 요구사항과 절차',
                    '성능 최적화의 중요성과 방법론',
                    '레거시 시스템 현대화 전략'
                ]
            }
        },
        {
            id: 'proj-5',
            type: 'project',
            itemType: 'project',
            title: '국가 시설 C 출입통제 개선 프로젝트',
            shortDescription: '국가 시설 C 출입통제 프로그램 SNMP 인터페이스 서버 및 화면 개발',
            fullDescription: '국가 시설의 출입통제 시스템에 SNMP 프로토콜 기반 네트워크 장비 연동 기능을 추가하고, React 기반의 모던한 관리 화면을 개발한 프로젝트입니다. 기존 시스템과의 통합을 고려하여 안정적인 인터페이스를 구축했습니다.',
            startYear: 2024,
            endYear: 2024,
            startMonth: 7,
            endMonth: 11,
            experienceId: 'exp-2',
            teamSize: 4,
            role: '풀스택 개발 (SNMP 서버 및 React 프론트엔드)',
            skills: [
                {
                    id: 'springboot-snmp',
                    name: 'Spring Boot',
                    category: 'backend',
                    usage: 'SNMP 인터페이스 서버 개발, REST API 구현',
                    experience: 'advanced'
                },
                {
                    id: 'react-access',
                    name: 'React',
                    category: 'frontend',
                    usage: '관리자 대시보드, 실시간 모니터링 UI 개발',
                    experience: 'intermediate'
                },
                {
                    id: 'snmp-protocol',
                    name: 'SNMP',
                    category: 'other',
                    usage: '네트워크 장비 모니터링, 데이터 수집 및 제어',
                    experience: 'beginner'
                }
            ],
            images: [],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'SNMP 인터페이스 서버 개발',
                    description: '네트워크 장비와 통신하기 위한 SNMP 프로토콜 기반 인터페이스 서버를 개발했습니다.',
                    challenges: 'SNMP 프로토콜에 대한 이해 부족과 다양한 장비 호환성',
                    solution: 'SNMP 라이브러리 활용과 단계적 테스트를 통한 호환성 확보'
                },
                {
                    id: 'impl-2',
                    title: 'React 기반 관리 대시보드 구축',
                    description: '실시간 장비 상태 모니터링과 제어가 가능한 React 기반 대시보드를 구축했습니다.',
                    challenges: '실시간 데이터 업데이트와 복잡한 상태 관리',
                    solution: 'WebSocket 연동과 Redux를 활용한 상태 관리'
                },
                {
                    id: 'impl-3',
                    title: '기존 시스템과의 통합',
                    description: '기존 출입통제 시스템과 새로운 SNMP 기능을 seamless하게 통합했습니다.',
                    challenges: '레거시 시스템과의 데이터 호환성과 동기화',
                    solution: '어댑터 패턴과 이벤트 기반 아키텍처 적용'
                }
            ],
            challenges: [
                'SNMP 프로토콜 학습과 구현',
                '실시간 데이터 처리 성능 최적화',
                '정부 보안 요구사항 준수',
                '다양한 네트워크 장비 호환성 확보'
            ],
            achievements: [
                '네트워크 장비 자동 모니터링 시스템 구축',
                '시스템 장애 감지 시간 80% 단축',
                '관리자 업무 효율성 60% 향상',
                '99.9% 시스템 가용성 달성'
            ],
            retrospective: {
                whatWentWell: [
                    'React 기반 모던 프론트엔드 개발 역량 강화',
                    'SNMP 프로토콜과 네트워크 프로그래밍 경험 습득',
                    '풀스택 개발 경험을 통한 전체적 시각 확보'
                ],
                whatCouldBeImproved: [
                    '네트워크 보안 측면 고려 부족',
                    '로드 테스트 및 성능 측정 미흡'
                ],
                lessonsLearned: [
                    '새로운 프로토콜 학습과 적용 방법',
                    '실시간 시스템 개발의 복잡성',
                    '레거시 시스템 통합의 어려움과 해결 방법'
                ]
            }
        },
        {
            id: 'proj-6',
            type: 'project',
            itemType: 'project',
            title: '국가 시설 C 통합 출입통제 개발 프로그램',
            shortDescription: '국가 시설 C 통합 출입통제 시스템 화면 개발',
            fullDescription: '국가 시설의 모든 출입통제 시스템을 통합 관리할 수 있는 웹 기반 플랫폼의 프론트엔드를 개발했습니다. React, Tailwind CSS, Zustand, React Query 등 모던 기술 스택을 활용하여 사용자 친화적이고 성능 최적화된 인터페이스를 구축했습니다.',
            startYear: 2025,
            endYear: 2025,
            startMonth: 1,
            endMonth: 9,
            experienceId: 'exp-2',
            teamSize: 5,
            role: '프론트엔드 개발 리드',
            skills: [
                {
                    id: 'react-integrated',
                    name: 'React',
                    category: 'frontend',
                    usage: '컴포넌트 아키텍처 설계, 복잡한 UI 구현, 성능 최적화',
                    experience: 'advanced'
                },
                {
                    id: 'tailwind-integrated',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '디자인 시스템 구축, 반응형 UI, 커스텀 컴포넌트 스타일링',
                    experience: 'advanced'
                },
                {
                    id: 'zustand-state',
                    name: 'Zustand',
                    category: 'frontend',
                    usage: '전역 상태 관리, 복잡한 데이터 플로우 관리',
                    experience: 'intermediate'
                },
                {
                    id: 'react-query-data',
                    name: 'React Query',
                    category: 'frontend',
                    usage: '서버 상태 관리, 캐싱, 실시간 데이터 동기화',
                    experience: 'intermediate'
                }
            ],
            images: [],
            implementation: [
                {
                    id: 'impl-1',
                    title: '모던 React 아키텍처 설계',
                    description: '확장 가능하고 유지보수가 용이한 React 애플리케이션 아키텍처를 설계했습니다.',
                    challenges: '복잡한 출입통제 도메인을 컴포넌트로 추상화하는 어려움',
                    solution: '도메인 주도 설계 원칙을 적용한 컴포넌트 구조화'
                },
                {
                    id: 'impl-2',
                    title: '실시간 데이터 동기화 시스템',
                    description: 'React Query를 활용하여 실시간 출입 현황과 시스템 상태를 동기화했습니다.',
                    challenges: '대량의 실시간 데이터 처리와 성능 최적화',
                    solution: '적절한 캐싱 전략과 optimistic updates 적용'
                },
                {
                    id: 'impl-3',
                    title: '통합 대시보드 구현',
                    description: '여러 시설의 출입통제 현황을 한눈에 볼 수 있는 통합 대시보드를 구현했습니다.',
                    challenges: '복잡한 데이터 시각화와 사용자 경험 최적화',
                    solution: '인터랙티브 차트와 직관적인 UI/UX 디자인 적용'
                }
            ],
            challenges: [
                '정부 웹 접근성 지침 준수',
                '대용량 실시간 데이터 처리',
                '복잡한 권한 관리 시스템 구현',
                '크로스 브라우저 호환성 확보'
            ],
            achievements: [
                '통합 관리 시스템을 통한 운영 효율성 70% 향상',
                '웹 접근성 AA 등급 인증 획득',
                '페이지 로드 시간 2초 이내 달성',
                '사용자 만족도 조사 90% 이상 긍정적 평가'
            ],
            retrospective: {
                whatWentWell: [
                    '모던 React 생태계에 대한 전문성 확보',
                    '대규모 프론트엔드 프로젝트 아키텍처 설계 경험',
                    '팀 리드 역할을 통한 협업 및 멘토링 경험'
                ],
                whatCouldBeImproved: [
                    '자동화된 테스트 커버리지 부족',
                    'CI/CD 파이프라인 최적화 필요'
                ],
                lessonsLearned: [
                    '대규모 프론트엔드 애플리케이션 아키텍처 설계 원칙',
                    '정부 프로젝트의 접근성과 보안 요구사항',
                    '팀 리드로서의 기술적 의사결정과 팀 관리'
                ]
            }
        },
        {
            id: 'proj-7',
            type: 'project',
            itemType: 'project',
            title: '온실가스 차트 웹페이지',
            shortDescription: '웹 개발 연습용 차트 페이지',
            fullDescription: '환경 데이터 시각화에 관심을 가지고 개발한 개인 프로젝트로, 전 세계 온실가스 배출량 데이터를 인터랙티브한 차트로 표현하는 웹페이지입니다. React와 Chart.js를 활용하여 다양한 형태의 데이터 시각화를 구현했습니다.',
            startYear: 2024,
            endYear: 2024,
            startMonth: 11,
            endMonth: 11,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/readmekym/greenhouse-gas-chart',
            liveDemo: 'https://greenhouse-gas-chart.vercel.app',
            skills: [
                {
                    id: 'react-chart',
                    name: 'React',
                    category: 'frontend',
                    usage: '컴포넌트 기반 UI 구현, 상태 관리',
                    experience: 'intermediate'
                },
                {
                    id: 'tailwind-chart',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '반응형 레이아웃, 컴포넌트 스타일링',
                    experience: 'intermediate'
                },
                {
                    id: 'chartjs',
                    name: 'Chart.js',
                    category: 'frontend',
                    usage: '인터랙티브 차트 구현, 데이터 시각화',
                    experience: 'beginner'
                }
            ],
            images: [],
            implementation: [
                {
                    id: 'impl-1',
                    title: '데이터 수집 및 처리',
                    description: '공개 API를 통해 온실가스 배출량 데이터를 수집하고 차트에 적합한 형태로 가공했습니다.',
                    challenges: '다양한 형태의 환경 데이터 통합과 정제',
                    solution: '데이터 파이프라인 구축과 정규화 과정 구현'
                },
                {
                    id: 'impl-2',
                    title: '인터랙티브 차트 구현',
                    description: '사용자가 국가별, 연도별로 데이터를 필터링하고 비교할 수 있는 인터랙티브 차트를 구현했습니다.',
                    challenges: 'Chart.js 라이브러리 학습과 커스터마이징',
                    solution: '단계적 학습과 공식 문서 활용'
                }
            ],
            challenges: [
                '데이터 시각화 라이브러리 학습',
                '대용량 환경 데이터 처리',
                '사용자 친화적인 인터페이스 설계'
            ],
            achievements: [
                '첫 번째 데이터 시각화 프로젝트 완성',
                'Chart.js 라이브러리 숙련도 확보',
                '환경 데이터에 대한 이해도 향상',
                '개인 포트폴리오 확장'
            ],
            retrospective: {
                whatWentWell: [
                    '새로운 라이브러리 빠른 학습과 적용',
                    '데이터 처리 및 시각화 경험 습득',
                    '개인 프로젝트를 통한 자기주도적 학습'
                ],
                whatCouldBeImproved: [
                    '코드 구조화와 재사용성 고려 부족',
                    '성능 최적화 미흡'
                ],
                lessonsLearned: [
                    '데이터 시각화의 중요성과 효과',
                    '사용자 관점에서의 정보 전달 방법',
                    '개인 프로젝트의 학습 효과'
                ]
            }
        },
        {
            id: 'proj-8',
            type: 'project',
            itemType: 'project',
            title: '가계부 프로그램',
            shortDescription: '데스크탑 가계부 애플리케이션',
            fullDescription: '개인 재정 관리의 필요성을 느껴 개발한 Electron 기반 데스크탑 애플리케이션입니다. React로 UI를 구성하고 SQLite로 로컬 데이터를 관리하여, 개인정보 보호와 편의성을 모두 고려한 가계부 프로그램을 만들었습니다.',
            startYear: 2024,
            endYear: 2025,
            startMonth: 12,
            endMonth: 1,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/readmekym/personal-budget-app',
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
            images: [],
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
                    solution: '정규화 원칙 적용과 인덱스 활용'
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
                '데이터 백업 및 복구 기능'
            ],
            achievements: [
                '개인용 가계부 프로그램 완성',
                'Electron 개발 경험 습득',
                'SQLite 데이터베이스 설계 능력 향상',
                '개인 재정 관리 효율성 향상'
            ],
            retrospective: {
                whatWentWell: [
                    '데스크탑 애플리케이션 개발 경험 확보',
                    '실제 사용할 수 있는 실용적인 프로그램 완성',
                    '로컬 데이터베이스 활용 능력 습득'
                ],
                whatCouldBeImproved: [
                    '앱 배포와 업데이트 메커니즘 구현 부족',
                    '보안 측면 고려 미흡'
                ],
                lessonsLearned: [
                    '개인의 실제 니즈를 해결하는 프로그램의 가치',
                    'Electron을 통한 웹 기술의 데스크탑 확장',
                    '로컬 우선 애플리케이션의 장점'
                ]
            }
        },
        {
            id: 'proj-9',
            type: 'project',
            itemType: 'project',
            title: '온라인 스캠 방지 사이트',
            shortDescription: '스캠 방지 교육 사이트',
            fullDescription: '최근 증가하는 온라인 스캠 피해를 예방하기 위해 개발한 교육용 웹사이트입니다. Next.js와 TypeScript를 활용하여 SEO 최적화된 정적 사이트를 구축하고, 다양한 스캠 유형과 대응 방법을 시나리오 기반으로 제공합니다.',
            startYear: 2025,
            endYear: 2025,
            startMonth: 7,
            endMonth: 7,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/readmekym/scam-prevention-site',
            liveDemo: 'https://scam-prevention.vercel.app',
            skills: [
                {
                    id: 'nextjs-ssg',
                    name: 'Next.js',
                    category: 'frontend',
                    usage: 'SSG(Static Site Generation), SEO 최적화, 라우팅',
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
            images: [],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'Next.js SSG 기반 정적 사이트 구축',
                    description: 'SEO 최적화와 빠른 로딩을 위해 Next.js의 Static Site Generation을 활용했습니다.',
                    challenges: 'SEO 최적화와 정적 사이트 구조 설계',
                    solution: 'Next.js의 getStaticProps와 메타데이터 최적화'
                },
                {
                    id: 'impl-2',
                    title: '스캠 시나리오 기반 교육 콘텐츠 구현',
                    description: '실제 스캠 사례를 바탕으로 한 인터랙티브 교육 콘텐츠를 구현했습니다.',
                    challenges: '복잡한 시나리오의 단순하고 이해하기 쉬운 표현',
                    solution: '단계별 시나리오와 시각적 가이드 제공'
                }
            ],
            challenges: [
                'SEO 최적화와 웹 접근성 확보',
                '복잡한 보안 개념의 쉬운 설명',
                '다양한 연령층을 고려한 UI/UX'
            ],
            achievements: [
                'Next.js SSG 기반 사이트 완성',
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
            shortDescription: '자동화된 멀티 블로그 관리 툴',
            fullDescription: '개발 경험과 지식을 여러 플랫폼에 효율적으로 공유하기 위해 개발한 데스크탑 애플리케이션입니다. Electron, React, TypeScript, TypeORM을 활용하여 다국어 지원과 여러 블로그 플랫폼에 동시 포스팅이 가능한 도구를 만들었습니다.',
            startYear: 2025,
            endYear: 2025,
            startMonth: 8,
            endMonth: 9,
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/readmekym/multi-blog-publisher',
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
                    id: 'typeorm-database',
                    name: 'TypeORM',
                    category: 'backend',
                    usage: '엔티티 설계, 관계 매핑, 마이그레이션 관리',
                    experience: 'beginner'
                },
                {
                    id: 'sqlite-advanced',
                    name: 'SQLite',
                    category: 'backend',
                    usage: '복잡한 쿼리, 성능 최적화, 데이터 무결성',
                    experience: 'intermediate'
                }
            ],
            images: [],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'TypeORM 기반 데이터 모델링',
                    description: '블로그 포스트, 플랫폼 설정, 다국어 콘텐츠를 관리하는 데이터 모델을 TypeORM으로 설계했습니다.',
                    challenges: '복잡한 관계형 데이터의 ORM 매핑과 성능 최적화',
                    solution: '엔티티 관계 최적화와 lazy loading 활용'
                },
                {
                    id: 'impl-2',
                    title: '다국어 지원 시스템 구축',
                    description: '한국어, 영어, 일본어 콘텐츠를 효율적으로 관리하고 번역할 수 있는 시스템을 구축했습니다.',
                    challenges: '다국어 콘텐츠의 동기화와 번역 품질 관리',
                    solution: 'i18n 라이브러리와 번역 API 연동'
                },
                {
                    id: 'impl-3',
                    title: '멀티 플랫폼 API 연동',
                    description: 'WordPress, Medium, Tistory 등 다양한 블로그 플랫폼의 API를 연동했습니다.',
                    challenges: '각 플랫폼별 상이한 API 스펙과 인증 방식',
                    solution: '어댑터 패턴을 활용한 통합 인터페이스 구축'
                },
                {
                    id: 'impl-4',
                    title: '리치 텍스트 에디터 구현',
                    description: '마크다운과 WYSIWYG를 지원하는 리치 텍스트 에디터를 구현했습니다.',
                    challenges: '복잡한 텍스트 포맷팅과 실시간 미리보기',
                    solution: 'Draft.js와 마크다운 파서 활용'
                }
            ],
            challenges: [
                '복잡한 데이터 관계 모델링',
                '다양한 블로그 플랫폼 API 호환성',
                '다국어 콘텐츠 동기화',
                '성능 최적화와 메모리 관리'
            ],
            achievements: [
                '개인 블로그 운영 효율성 90% 향상',
                'TypeORM과 고급 데이터베이스 설계 경험 습득',
                '복잡한 Electron 애플리케이션 완성',
                '다국어 콘텐츠 관리 시스템 구축'
            ],
            retrospective: {
                whatWentWell: [
                    '복잡한 요구사항을 체계적으로 분석하고 구현',
                    'TypeScript와 TypeORM을 통한 타입 안전성 확보',
                    '실제 업무 효율성을 크게 개선하는 도구 완성'
                ],
                whatCouldBeImproved: [
                    '에러 처리와 복구 메커니즘 강화 필요',
                    '사용자 가이드와 문서화 부족'
                ],
                lessonsLearned: [
                    '복잡한 도메인의 모델링과 추상화 중요성',
                    'ORM 활용 시 성능 고려사항',
                    '개인 생산성 도구의 가치와 효과'
                ]
            }
        }
    ]
}