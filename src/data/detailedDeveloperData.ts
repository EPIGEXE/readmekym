import type { DetailedDeveloperData } from "./detailedDeveloperDataType";

export const detailedDeveloperData: DetailedDeveloperData = {
    experiences: [
        {
            id: 'exp-1',
            type: 'experience',
            title: 'Siemens Solution Engineer',
            subtitle: 'SCOP',
            shortDescription: 'PLM 솔루션 엔지니어',
            fullDescription: '글로벌 제조업체를 대상으로 한 Siemens PLM(Product Lifecycle Management) 솔루션 구축 및 고도화 프로젝트를 담당했습니다. Teamcenter를 중심으로 한 PLM 시스템 컨설팅, 구축, 커스터마이징 업무를 수행하며 제조업의 디지털 트랜스포메이션을 지원했습니다.',
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
            title: 'Web Developer',
            subtitle: 'CATIS',
            shortDescription: '웹 개발 및 솔루션 개발',
            fullDescription: '보안 솔루션 전문 기업에서 출입통제 시스템 및 보안 관련 웹 애플리케이션 개발을 담당했습니다. .NET, Spring Boot, React 등 다양한 기술 스택을 활용하여 정부 및 공공기관 대상 보안 솔루션을 개발하고 유지보수했습니다.',
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
                '국가 시설 C 출입통제 시스템 성공적 구축',
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
                    usage: 'REST API 개발',
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
                    '다양한 기술 스택 경험을 통한 개발 역량 강화',
                    'React 생태계에 대한 깊은 이해와 모던 프론트엔드 개발 경험',
                    'WebSocket 통신을 활용한 실시간 데이터 처리',
                    '대량의 데이터를 화면에 렌더링하기 위한 최적화 경험'
                ],
                whatCouldBeImproved: [
                    '테스트 코드 작성 및 CI/CD 파이프라인 구축 경험 부족',
                    '기술 스택의 집중화 부족'
                ],
                lessonsLearned: [
                    '보안 시스템 개발 시 사용자 편의성과 보안성의 균형을 맞추는 것의 중요성',
                    'React와 같은 모던 프레임워크 도입의 개발 생산성과 유지보수성 향상',
                    '다양한 기술 스택을 경험과 핵심 기술에 대한 깊이 있는 이해의 조율'
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
            title: '제조 회사 A사 PLM 업그레이드',
            shortDescription: '치과의료 기기 제조 회사 PLM 시스템 업그레이드',
            fullDescription: '치과의료기기 제조업체의 레거시 PLM 시스템을 Siemens Teamcenter 최신 버전으로 업그레이드하고, 제품 사양관리(Specification Management) 모듈을 새롭게 구축한 프로젝트입니다. 시스템 업그레이드와 동시에 의료기기 산업의 특성을 반영한 제품 사양 관리 체계를 도입하여 제품 개발 프로세스의 효율성을 향상시켰습니다.',
            experienceId: 'exp-1',
            teamSize: 4,
            role: 'PLM 엔지니어 (사양관리 모듈 담당)',
            skills: [
                {
                    id: 'teamcenter-upgrade',
                    name: 'Siemens Teamcenter',
                    category: 'other',
                    usage: '시스템 업그레이드 수행, 데이터 검증, 워크플로우 설계',
                    experience: 'advanced'
                },
                {
                    id: 'specification-management',
                    name: 'Teamcenter 사양관리',
                    category: 'other',
                    usage: '제품 사양 데이터 모델링, 사양서 템플릿 구성, Requirements Management',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'Teamcenter 시스템 업그레이드 지원',
                    description: '선임 엔지니어가 주도하는 Teamcenter 11.6에서 12.4로의 메이저 버전 업그레이드 작업을 지원했습니다. 테스트 환경에서 업그레이드 후 기존 기능들이 정상 작동하는지 검증하고, 발견된 문제점들을 문서화하여 보고했습니다. 특히 커스터마이징된 워크플로우와 사용자 권한이 새 버전에서도 제대로 동작하는지 꼼꼼히 테스트했습니다.',
                    challenges: '업그레이드 후 기존과 달라진 UI로 인한 혼란, 테스트 시나리오 작성 경험 부족, 업그레이드 중 발견된 데이터 정합성 문제',
                    solution: 'Teamcenter 11.6과 12.4의 릴리즈 노트를 꼼꼼히 읽으며 변경 사항을 파악했고, 선임 엔지니어에게 질문하며 학습했습니다. 고객사의 실제 업무 프로세스를 기반으로 테스트 시나리오를 작성했고, 테스트 중 발견된 데이터 오류는 고객사와 협의하여 업그레이드 전에 정제 작업을 진행했습니다.'
                },
                {
                    id: 'impl-2',
                    title: '사양관리(Specification Management) 모듈 구축',
                    description: '치과의료기기의 제품 사양을 체계적으로 관리할 수 있는 모듈을 새롭게 구축했습니다. 제품별 요구사항(Requirements), 기술 사양(Technical Specification), 테스트 기준 등을 연결하여 추적 가능하도록 데이터 모델을 설계했습니다. 사양서 문서 템플릿을 표준화하고, 사양 변경 시 승인 워크플로우를 구성했습니다.',
                    challenges: '사양관리를 처음 도입하는 고객사의 불명확한 요구사항, 기존 Word/Excel 기반 사양서의 표준화 필요성, 복잡한 사양 관리 프로세스를 단순화하는 균형점 찾기, 업그레이드와 동시 진행으로 인한 일정 압박',
                    solution: '사양관리 모듈의 첫 도입인 만큼 복잡한 기능보다는 핵심 기능에 집중했습니다. 파일럿 프로젝트로 한 개 제품군에 먼저 적용하여 검증 후 전체로 확대하는 단계적 접근을 제안하고 적용했습니다.'
                }
            ],
            challenges: [
                '메이저 버전 업그레이드에 따른 UI 변경과 Deprecated 기능 대응',
                '업그레이드 후 데이터 정합성 검증 및 문제 발견 시 해결 방법 모색',
                '사양관리 모듈 첫 도입에 따른 불명확한 요구사항과 변화 관리',
                '업그레이드와 신규 모듈 개발을 동시에 진행하는 일정 압박',
            ],
            achievements: [
                '6개월 만에 메이저 버전 업그레이드와 신규 모듈 구축 동시 완료',
                '시스템 장애 없이 안정적인 업그레이드 달성',
                '사양관리 프로세스 도입으로 사양서 작성 및 검토 시간 단축',
                '제품 사양 변경 이력 추적 체계 확립',
                '표준화된 사양서 템플릿으로 부서 간 의사소통 오류 감소'
            ],
            retrospective: {
                whatWentWell: [
                    '선임 엔지니어의 가이드를 받으며 대형 업그레이드 프로젝트의 전체 프로세스 경험',
                    '테스트 환경에서의 충분한 검증으로 운영 환경 전환 시 큰 문제 없이 안착',
                    '파일럿 프로젝트를 통한 사양관리 모듈 검증 및 점진적 확대 전략 성공',
                ],
                whatCouldBeImproved: [
                    '프로젝트 중후반으로 갈수록 고객사 핵심 담당자들의 참여도가 떨어져 의사결정이 지연됨',
                    '업그레이드 전 데이터 품질 점검을 더 철저히 했다면 업그레이드 후 정제 작업을 줄일 수 있었을 것',
                    '프로젝트 종료 후 노하우와 산출물을 체계적으로 문서화하고 팀 내 공유하는 프로세스 부족',
                    '사용자 교육을 프로젝트 막바지에 진행하여 충분한 피드백 반영 시간 부족'
                ],
                lessonsLearned: [
                    'PLM 시스템 업그레이드는 단순히 버전을 올리는 것이 아니라 UI 변경, Deprecated 기능 대응, 데이터 정합성 검증 등 다각도의 준비가 필요함',
                    '메이저 버전 업그레이드 시에는 릴리즈 노트를 꼼꼼히 읽고 변경 사항을 사전에 파악하는 것이 중요',
                    '업그레이드 전 데이터 품질 점검이 얼마나 중요한지 실감 - 평소 관리되지 않던 데이터 오류가 새 버전에서 문제를 일으킴',
                    'PLM 시스템 변경은 조직 전체의 변화 관리 프로젝트이므로 이해관계자들의 지속적인 참여가 필수',
                    '새로운 기능 도입 시 처음부터 완벽을 추구하기보다 핵심 기능부터 시작하는 점진적 접근이 효과적',
                    '프로젝트 경험과 지식을 조직 자산으로 축적하는 것이 개인과 팀의 성장에 중요함'
                ]
            }
        },
        {
            id: 'proj-2',
            type: 'project',
            title: '제약 회사 B사 BOM 프로젝트',
            shortDescription: '바이오 의약품 제조 회사 BOM 시스템 구축',
            fullDescription: '바이오 의약품 제조업체의 제품 데이터를 체계적으로 관리하기 위한 PLM 시스템 구축 프로젝트입니다. Siemens RDNL 솔루션을 도입하여 기존 Excel로 관리되던 BOM 데이터를 마이그레이션하고, 고객사의 중앙 데이터 시스템과 통합하여 통합 제품 데이터 관리 환경을 구축했습니다.',
            experienceId: 'exp-1',
            teamSize: 10,
            role: 'PLM 엔지니어 (BOM 관리)',
            skills: [
                {
                    id: 'rdnl',
                    name: 'Siemens RDNL',
                    category: 'other',
                    usage: 'RDNL 솔루션 설치 및 구성, 시스템 커스터마이징',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'RDNL 솔루션 설치 및 환경 구성',
                    description: 'Siemens RDNL 솔루션을 고객사 서버 환경에 설치하고 기본 설정을 진행했습니다. 데이터베이스 구성, 사용자 계정 및 권한 설정, 네트워크 환경 구성 등 시스템 기반을 구축했습니다.',
                    challenges: '이중화 구성 요구사항',
                    solution: '고객사 IT 부서와 협업하여 방화벽 예외 설정을 진행하고 L4 스위치의 로드밸런싱을 이용한 이중화 구성을 하였습니다. RDNL의 표준 설치 가이드를 따르되 고객사의 환경을 고려한 추가 설정을 적용했습니다.'
                },
                {
                    id: 'impl-2',
                    title: '기존 Excel BOM 데이터 마이그레이션',
                    description: '고객사가 Excel로 관리하던 수백 개의 바이오 의약품 BOM 데이터를 분석하고 RDNL 마이그레이션했습니다. Excel 파일마다 형식이 조금씩 달라서 데이터 표준화 작업이 필요했고, 제품 구조, 부품 정보, 제조 정보 등을 RDNL의 데이터 모델에 맞게 변환했습니다.',
                    challenges: 'Excel 파일마다 다른 형식과 구조, 데이터 품질 이슈(중복, 누락, 오타), 부품 간 관계 정보의 불명확함',
                    solution: 'Excel 데이터를 분석하여 공통 패턴을 찾아 표준 템플릿을 정의하고, 데이터 품질 문제는 고객사 담당자와 리뷰 미팅을 통해 하나씩 해결했습니다'
                },
                {
                    id: 'impl-3',
                    title: '중앙 데이터 시스템과 PLM 시스템 통합',
                    description: '고객사의 기존 중앙 데이터 관리 시스템(ERP 및 MES)과 RDNL 연동하여 제품 정보가 동기화되도록 구축했습니다. 중앙 시스템에서 승인된 제품 정보가 자동으로 RDNL 전송되고, 반대로 RDNL 변경된 BOM 정보가 중앙 시스템으로 전달되는 양방향 인터페이스를 개발했습니다.',
                    challenges: '서로 다른 데이터 모델 간의 매핑, 실시간 동기화 시 데이터 정합성 유지, 네트워크 장애 발생 시 데이터 유실 방지, 통합 테스트 환경 구축의 어려움',
                    solution: '양 시스템의 데이터 모델을 상세히 분석하여 매핑 테이블을 작성하고, 데이터 변환 규칙을 문서화했습니다. 실시간 동기화 대신 배치 동기화 방식을 채택하여 안정성을 확보했고, 동기화 실패 시 재시도 로직과 에러 로깅 기능을 구현했습니다. 통합 테스트는 고객사와 함께 실제 데이터를 샘플링하여 단계적으로 진행했습니다.'
                }
            ],
            challenges: [
                'RDNL 솔루션을 고객사의 보안 환경에 맞게 설치 및 구성',
                '표준화되지 않은 Excel BOM 데이터의 분석 및 정제',
                '서로 다른 시스템(PLM, ERP, MES) 간의 데이터 모델 차이 해소',
                '실시간 데이터 동기화 시 정합성 및 안정성 확보'
            ],
            achievements: [
                'Teamcenter RDNL 솔루션 성공적 구축 및 안정적 운영 환경 확보',
                '500개 이상의 바이오 의약품 BOM 데이터를 오류 없이 마이그레이션',
                'PLM과 중앙 시스템 간 자동 데이터 동기화로 엑셀 수작업에서 솔루션 입력으로 단축',
                '데이터 표준화로 제품 정보 검색 및 활용 효율성 향상',
                '시스템 통합으로 부서 간 데이터 불일치 문제 해결'
            ],
            retrospective: {
                whatWentWell: [
                    'RDNL 솔루션의 표준 기능을 활용하여 빠른 시스템 구축',
                    '고객사 담당자와의 긴밀한 협업으로 데이터 품질 이슈 조기 해결',
                    '단계적 통합 접근으로 리스크 최소화'
                ],
                whatCouldBeImproved: [
                    '초기 데이터 분석에 더 많은 시간을 할애했다면 마이그레이션 중 발견된 예외 케이스들을 사전에 파악할 수 있었을 것',
                    '마이그레이션 스크립트 개발 시 에러 발생 지점과 원인을 명확히 알 수 있는 로깅 체계 부족',
                    '통합 테스트를 위한 별도 환경이 없어 운영 환경에서 직접 테스트하며 불안감이 있었음',
                    '데이터 동기화 상태를 실시간으로 모니터링할 수 있는 대시보드가 없어 문제 발생 시 파악이 늦어짐',
                    'Excel 데이터 정제 과정에서 고객사와 데이터 품질 기준을 미리 합의하지 않아 반복 작업 발생'
                ],
                lessonsLearned: [
                    'PLM 솔루션 도입 시 패키지 솔루션(RDNL)을 활용하면 구축 기간을 크게 단축할 수 있음',
                    '데이터 마이그레이션 프로젝트에서는 데이터 품질과 표준화가 성공의 핵심',
                    'Excel과 같은 레거시 시스템의 데이터는 예상보다 훨씬 다양한 예외 케이스를 포함하고 있어 충분한 분석 시간 필요',
                    '시스템 통합 시 실시간 동기화보다 배치 동기화가 안정성과 에러 처리 측면에서 유리할 수 있음',
                    '외부 시스템 연동은 상대 시스템의 변경에 취약하므로, 인터페이스 버전 관리와 문서화가 중요',
                    '고객사의 보안 정책과 네트워크 환경은 프로젝트 초기에 면밀히 검토해야 예상치 못한 지연을 방지할 수 있음'
                ]
            }
        },
        {
            id: 'proj-3',
            type: 'project',
            title: 'Catis 출입통제 프로그램 Axilog 개선',
            shortDescription: 'CATIS 출입통제 프로그램 Axilog의 UI/UX 개선 및 기능 최적화',
            fullDescription: 'CATIS의 기존 출입통제 프로그램인 Axilog의 사용성 개선과 불필요한 기능 제거를 담당했습니다. C#과 .NET Framework 기반의 Windows Forms 클라이언트 애플리케이션을 분석하고, 사용자 피드백을 바탕으로 70여 개의 개선사항을 검토하여 40개 이상의 개선사항을 구현했습니다.',
            experienceId: 'exp-2',
            teamSize: 2,
            role: '요구사항 분석 및 개선',
            skills: [
                {
                    id: 'csharp-axilog',
                    name: 'C#',
                    category: 'frontend',
                    usage: 'Windows Forms 클라이언트 개발, UI 컴포넌트 개선, 이벤트 핸들링',
                    experience: 'intermediate'
                },
                {
                    id: 'dotnet-axilog',
                    name: '.NET Framework',
                    category: 'frontend',
                    usage: 'Windows Forms 애플리케이션 개발, 클라이언트-서버 통신',
                    experience: 'intermediate'
                },
                {
                    id: 'winforms-axilog',
                    name: 'Windows Forms',
                    category: 'frontend',
                    usage: 'UI 컴포넌트 커스터마이징, 사용자 인터페이스 개선',
                    experience: 'intermediate'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'UI/UX 개선 및 사용성 향상',
                    description: '사용자 피드백을 바탕으로 트리 메뉴 숨김 기능 추가, 툴팁을 통한 메뉴 설명 제공, 목록창 컬럼 최적화 등 직관적인 UI로 개선했습니다. 40개 이상의 메뉴에 한국어/영어 툴팁을 추가하여 사용자 편의성을 높이고, 자주 사용하는 메뉴를 중심으로 단계적 개선을 진행했습니다.',
                    challenges: '다양한 사용자 요구사항과 Windows Forms의 UI 제약사항 사이의 균형, 툴팁이 메뉴 클릭을 방해하는 문제',
                    solution: '우선순위가 높은 개선사항을 선별하고, 자주 사용하는 메뉴를 중심으로 단계적으로 UI를 개선했습니다. 툴팁과 같은 비침투적 방식으로 사용자 가이드를 제공하고, AppMenu 테이블에 Tooltip 컬럼을 추가하여 다국어 지원을 구현했습니다. 툴팁 표시 로직을 개선하여 메뉴 클릭을 방해하지 않도록 수정했습니다.'
                },
                {
                    id: 'impl-2',
                    title: '데이터 입력 및 설정 개선',
                    description: '사용자 정보 입력 순서 조정, 시간대 기본값 설정, 비밀번호 변경 시 보안 강화 등 실용적인 개선을 진행했습니다. 자주 사용하는 항목을 상단으로 배치하고, 보안이 필요한 부분에는 추가 인증 단계를 추가했습니다.',
                    challenges: '기존 사용자의 작업 흐름을 방해하지 않으면서 더 나은 사용성 제공',
                    solution: '사용자 피드백을 바탕으로 자주 사용하는 항목(부서/직책/고용형태)을 상단으로 배치하여 입력 효율성을 높였습니다. 클라이언트 설정의 시간대 초기값을 서울로 설정하여 추가 설정 없이 바로 사용할 수 있도록 했습니다. 보안 관리자가 다른 사용자의 비밀번호를 변경할 때 본인 비밀번호 입력을 요구하는 추가 인증 단계를 구현하여 권한 남용을 방지했습니다.'
                },
                {
                    id: 'impl-3',
                    title: '버그 수정 및 안정성 개선',
                    description: '장치 모니터, 경보 모니터, 트리 메뉴 등에서 발생하는 버그를 수정하여 시스템 안정성을 향상시켰습니다. 사용자 피드백을 통해 재현 조건을 파악하고, UI 상태 관리 로직을 개선했습니다.',
                    challenges: '재현이 어려운 버그와 UI 상태 관리 문제, 사용자 작업 흐름 중단 방지',
                    solution: '사용자 피드백을 면밀히 분석하여 재현 조건을 파악하고, 각 화면의 상태 관리 로직을 개선했습니다. 펌웨어 업데이트 화면의 취소 버튼 클릭 시 주제어기 목록을 유지하도록 수정하여 작업 흐름을 보존하고, 장치 모니터의 입출력 상태 화면 닫기 시 최소화 방지 로직을 추가했습니다. 컬럼 설정 후 적용 버튼 클릭 시 팝업이 자동으로 닫히도록 개선하여 불필요한 클릭을 줄였습니다.'
                }
            ],
            challenges: [
                '레거시 Windows Forms 애플리케이션의 복잡한 코드 구조',
                '70개 이상의 개선 요청 중 우선순위 선정 및 실행 가능성 검토',
                '서로 다른 사용 환경과 요구사항 조율'
            ],
            achievements: [
                '총 70개의 개선사항 검토 및 40개 이상의 개선사항 구현',
                'UI/UX 개선으로 사용자 작업 효율성 향상',
                '불필요한 기능 제거로 애플리케이션 복잡도 감소',
                '검색 및 필터링 정확도 개선',
            ],
            retrospective: {
                whatWentWell: [
                    '체계적인 개선사항 관리로 엑셀 파일을 통한 이슈 추적',
                    '사용자 피드백 기반의 실용적인 개선',
                    'Windows Forms 환경에서의 UI 커스터마이징 역량 강화',
                ],
                whatCouldBeImproved: [
                    'UI 개선 전후 사용성 테스트 및 정량적 평가 부족',
                    '개선사항 우선순위 선정 시 사용자 간 의견 충돌 조율 과정 개선 필요',
                ],
                lessonsLearned: [
                    '레거시 시스템에서는 점진적 개선과 우선순위 선정이 중요',
                    '사용자와의 긴밀한 소통을 통한 요구사항 명확화',
                    'Windows Forms와 같은 레거시 UI 프레임워크의 제약사항 이해',
                    'UI 개선 시 기존 사용자의 작업 흐름을 존중하면서 점진적으로 변화를 도입하는 것이 중요',
                ]
            }
        },
        {
            id: 'proj-4',
            type: 'project',
            title: '화물검색 이력관리 프로그램 개선',
            shortDescription: '국가 시설 C 납품용 X-ray 화물검색 이력관리 프로그램 개선',
            fullDescription: '국가 시설에 납품할 X-ray 화물검색 이력관리 프로그램의 화면 개선 프로젝트입니다. 외주업체에서 Spring Boot와 Thymeleaf로 개발한 기존 시스템이 고객 요구사항을 충족하지 못하는 화면 표시 문제가 있어, 사용자 인터페이스를 전면 재구축하고 Spring Scheduler를 활용한 데이터 백업 기능을 추가했습니다.',
            experienceId: 'exp-2',
            teamSize: 1,
            role: '프론트엔드 화면 재구축 및 백업 시스템 개발',
            skills: [
                {
                    id: 'springboot-cargo',
                    name: 'Spring Boot',
                    category: 'backend',
                    usage: '기존 백엔드 로직 분석, API 활용, REST 엔드포인트 수정',
                    experience: 'intermediate'
                },
                {
                    id: 'thymeleaf-cargo',
                    name: 'Thymeleaf',
                    category: 'frontend',
                    usage: '사용자 인터페이스 재구축, 동적 화면 구현, 데이터 바인딩',
                    experience: 'intermediate'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '사용자 인터페이스 전면 재구축',
                    description: '고객 요구사항을 충족하지 못하는 기존 화면을 Thymeleaf 기반으로 완전히 재설계했습니다. 외주업체에서 개발한 UI가 실제 업무 흐름과 맞지 않고 필수 정보가 누락되어 있어, 요구사항을 재정의하고 화면을 새로 구성했습니다.',
                    challenges: '기존 Spring Boot 백엔드 로직은 유지하면서 화면만 새로 구성해야 하는 제약, 외주업체 코드의 불충분한 문서화',
                    solution: '기존 API 엔드포인트를 최대한 활용하되, 필요한 경우 컨트롤러와 서비스 레이어를 수정하여 화면에 필요한 데이터를 제공하도록 했습니다.'
                },
                {
                    id: 'impl-2',
                    title: '화물 이력 표시 화면 개선',
                    description: '화물 태깅 위치, X-ray 이미지, 검색 결과를 한눈에 볼 수 있는 통합 화면을 구현했습니다. 기존에는 각 정보가 별도 화면에 분산되어 있어 담당자가 여러 화면을 오가며 정보를 확인해야 했는데, 이를 하나의 대시보드 형태로 통합하여 업무 효율성을 크게 높였습니다.',
                    challenges: '복잡한 검색 이력 데이터를 사용자가 이해하기 쉽게 표현',
                    solution: '시각적 매핑과 시간순 정렬을 통해 화물의 검색 이력을 직관적으로 표현했습니다.'
                }
            ],
            challenges: [
                '외주업체 개발 시스템의 요구사항 미충족 및 불충분한 문서화',
                '기존 Spring Boot 백엔드 로직 유지하면서 화면 재구축',
                '복잡한 화물 검색 이력 데이터의 직관적 표현',
            ],
            achievements: [
                '통합 대시보드 구현으로 업무 효율성 향상',
                '검색 화면 개선으로 담당자의 화물 추적 시간 단축'
            ],
            retrospective: {
                whatWentWell: [
                    'Thymeleaf를 활용한 서버 사이드 렌더링 경험'
                ],
                whatCouldBeImproved: [
                    '프론트엔드 기술 스택 현대화 필요 (React, Vue 등 SPA 프레임워크 고려)',
                    '초기 외주업체 코드 분석에 더 많은 시간을 할애했다면 예상치 못한 이슈 방지 가능',
                    'API 문서화가 부족하여 백엔드-프론트엔드 간 커뮤니케이션 비용 발생'
                ],
                lessonsLearned: [
                    '외주업체가 개발한 시스템을 인수받을 때는 코드 품질과 문서화 상태를 면밀히 검토해야 함',
                    '레거시 시스템 현대화 시 전면 재작성보다는 점진적 개선이 리스크를 줄일 수 있음',
                    'Thymeleaf는 간단한 동적 페이지에는 적합하지만, 복잡한 인터랙션이 필요한 경우 SPA 프레임워크가 더 유리함',
                    '현장 사용자의 피드백을 자주 받는 것이 요구사항 미스매치를 줄이는 가장 효과적인 방법'
                ]
            }
        },
        {
            id: 'proj-5',
            type: 'project',
            title: '국가 시설 C 출입통제 개선 프로젝트',
            shortDescription: '국가 시설 C 출입통제 시스템 SNMP 인터페이스 서버 개발',
            fullDescription: '국가 시설의 출입통제 시스템을 Spring Cloud 기반 마이크로서비스로 구축하는 프로젝트에서 SNMP 인터페이스 서버를 담당했습니다. 각 네트워크 장비에 정해진 OID(Object Identifier)로 SNMP 호출을 보내 장비 상태 및 허브 포트 상태를 실시간으로 확인하는 마이크로서비스를 개발했습니다. 기존 모놀리식 시스템에서는 장비 장애 감지가 지연되는 문제가 있었으나, SNMP 기반 실시간 모니터링을 통해 장애 대응 시간을 크게 단축했습니다.',
            experienceId: 'exp-2',
            teamSize: 4,
            role: 'SNMP 인터페이스 서버 개발 (마이크로서비스)',
            skills: [
                {
                    id: 'springboot-snmp',
                    name: 'Spring Boot',
                    category: 'backend',
                    usage: 'SNMP 인터페이스 마이크로서비스 개발, REST API 구현, 스케줄링 작업',
                    experience: 'intermediate'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'OID 기반 SNMP 장비 상태 조회 서비스',
                    description: '각 네트워크 장비(스위치, 라우터, 방화벽 등)에 정해진 OID로 SNMP GET 요청을 보내 장비가 정상 작동 중인지 확인하는 서비스를 개발했습니다. SNMP4J 라이브러리를 활용하여 다양한 장비 제조사(Cisco, HP, Juniper 등)의 표준 MIB와 확장 MIB를 지원하도록 구현했습니다. 장비별로 시스템 정보(sysUpTime, sysDescr, sysName 등)를 조회하고, 응답 시간 초과나 에러 발생 시 장애로 판단하여 알림을 발송합니다.',
                    challenges: 'SNMP OID 체계와 MIB 구조 이해, 다양한 장비별 SNMP 버전과 커뮤니티 스트링 관리, 타임아웃과 재시도 로직 구현',
                    solution: 'SNMP4J 라이브러리를 사용하여 SNMP v2c 프로토콜 기반의 GET 요청을 구현했습니다. 장비 제조사별 표준 MIB 문서를 분석하여 공통으로 사용할 수 있는 OID 목록을 정리했습니다.'
                },
                {
                    id: 'impl-2',
                    title: '허브 포트 상태 모니터링 시스템',
                    description: '네트워크 허브 장비의 각 포트 상태를 SNMP로 조회하여 포트가 정상적으로 연결되어 있는지 확인하는 시스템을 구축했습니다. 포트 상태 변화(UP→DOWN 등)가 감지되면 이벤트를 발생시켜 출입통제 시스템에 알림을 전달합니다.',
                    challenges: '대상 허브별로 상이한 포트 상태 OID와 응답 값 해석',
                    solution: '장비 제조사별 MIB 파일을 분석하여 표준 인터페이스 MIB(IF-MIB)의 OID를 활용하는 방식으로 호환성을 확보했습니다.'
                }
            ],
            challenges: [
                'SNMP OID 체계와 MIB 구조에 대한 이해 부족',
                '다양한 장비 제조사별 SNMP 응답 차이 처리',
            ],
            achievements: [
                'SNMP 기반 장비 상태 모니터링 마이크로서비스 구축 완료',
                '허브 포트 상태 실시간 조회 시스템 완성',
                '장비 장애 발생 시 포트 연결 상태 즉시 파악으로 대응 시간 단축',
            ],
            retrospective: {
                whatWentWell: [
                    '다양한 장비 제조사별 호환성 문제를 체계적으로 해결',
                ],
                whatCouldBeImproved: [
                    'MIB 구조와 SNMP Trap에 대한 더 깊은 이해가 필요',
                    '장비 장애 상황(네트워크 단절, 타임아웃 등)에 대한 예외 처리를 더 세밀하게 구현할 필요',
                ],
                lessonsLearned: [
                    'SNMP 프로토콜은 GET/GETNEXT/GETBULK/SET/TRAP 등 다양한 방식이 있으며, 상황에 맞는 적절한 방식 선택이 성능에 큰 영향을 미침',
                    'SNMP GETBULK는 대량의 OID를 조회할 때 효율적',
                    'MIB 파일 분석 도구(MIB Browser 등)를 활용하면 OID 구조를 이해하는 데 큰 도움이 됨'
                ]
            }
        },
        {
            id: 'proj-6',
            type: 'project',
            title: '국가 시설 C 통합 출입통제 개발 프로그램',
            shortDescription: 'React + Konva 기반 실시간 도면 모니터링 및 생체인식 장치 제어 시스템',
            fullDescription: '국가 시설의 출입통제 시스템에서 React와 Konva.js를 활용한 실시간 도면 기반 모니터링 화면과 생체인식 장치 제어 인터페이스를 담당했습니다. WebSocket을 통해 수백 개의 도어와 생체인식 장치 상태를 실시간으로 수신하고, Konva Canvas 위에 시설 도면과 도어 객체를 렌더링하여 경보 발생 시 시각적/청각적 알림을 제공하는 시스템을 구축했습니다. Zustand를 활용한 복잡한 상태 관리와 React DnD를 통한 직관적인 도어-경보 연결 UI를 구현하여 관제 요원의 업무 효율성을 크게 향상시켰습니다.',
            experienceId: 'exp-2',
            teamSize: 5,
            role: '프론트엔드 개발 (도면 모니터링 시스템 및 생체인식 장치 제어 UI 전담)',
            skills: [
                {
                    id: 'react-integrated',
                    name: 'React',
                    category: 'frontend',
                    usage: 'Hooks 기반 컴포넌트 설계, 복잡한 상태 로직 최적화, 실시간 데이터 처리',
                    experience: 'advanced'
                },
                {
                    id: 'konva-canvas',
                    name: 'Konva.js',
                    category: 'frontend',
                    usage: 'Canvas 기반 도면 렌더링, 드래그 앤 드롭, 객체 선택/이동, 줌/팬 구현',
                    experience: 'advanced'
                },
                {
                    id: 'zustand-state',
                    name: 'Zustand',
                    category: 'frontend',
                    usage: '도어 목록, 경보 목록, WebSocket 상태 등 글로벌 상태 관리',
                    experience: 'intermediate'
                },
                {
                    id: 'websocket-client',
                    name: 'WebSocket',
                    category: 'frontend',
                    usage: 'STOMP 프로토콜 기반 실시간 양방향 통신, 토픽 구독/발행 패턴',
                    experience: 'intermediate'
                },
                {
                    id: 'react-dnd',
                    name: 'React DnD',
                    category: 'frontend',
                    usage: '경보-도어 드래그 앤 드롭 연결, Konva Canvas와 HTML5 Backend 통합',
                    experience: 'intermediate'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'Konva Canvas 기반 실시간 도어 모니터링 시스템',
                    description: '시설 도면을 배경 이미지로 불러오고, Konva Stage 위에 수백 개의 도어 객체를 동적으로 렌더링하는 시스템을 구축했습니다. 각 도어는 Layer/Image/Rect 컴포넌트로 구성되며, WebSocket으로 받은 실시간 상태(정상/경보/장애)에 따라 색상이 변경됩니다. 마우스 휠을 통한 줌(0.5x~2x), 드래그를 통한 패닝, 영역 선택을 통한 다중 도어 선택 등 관제 화면에 필요한 인터랙션을 구현했습니다. 편집 모드에서는 도어를 자유롭게 배치하고, 드래그로 위치를 조정할 수 있으며, 변경 사항은 백엔드 API로 저장됩니다.',
                    challenges: 'Konva Stage의 좌표계와 React DnD의 HTML 좌표계 불일치로 인해 경보 카드를 도면 위로 드래그할 때 정확한 위치 계산이 어려웠습니다. 또한 수백 개의 도어 객체를 실시간으로 렌더링하면서 60fps를 유지하기 위한 성능 최적화가 필요했습니다.',
                    solution: 'React DnD의 monitor.getClientOffset()으로 얻은 브라우저 좌표를 Konva의 setPointersPositions()로 전달하고, getRelativePointerPosition()으로 Canvas 좌표계로 변환하는 방식으로 해결했습니다. 성능 최적화를 위해 React.memo와 useMemo를 활용하여 불필요한 리렌더링을 방지하고, Konva의 Layer 분리를 통해 배경 이미지와 도어 객체를 독립적으로 관리했습니다. WebSocket 메시지를 배치 처리하여 여러 도어의 상태 변경을 한 번에 업데이트하도록 개선하여 렌더링 횟수를 크게 줄였습니다.'
                },
                {
                    id: 'impl-2',
                    title: 'WebSocket 기반 실시간 이벤트 처리 및 경보음 시스템',
                    description: 'STOMP 프로토콜을 사용하는 WebSocket 연결을 통해 "DM_EVENT" 토픽을 구독하여 도어 상태 변경 이벤트를 실시간으로 수신하는 시스템을 구현했습니다. 메시지 포맷은 { graphic_code: ["G0070", "G0071"], graphic_status: 1 } 형태로 여러 도어의 상태가 한 번에 전달되며, 이를 파싱하여 Zustand 스토어의 도어 상태를 일괄 업데이트합니다. 경보 발생 시(graphic_status === 1) Web Audio API를 활용하여 경보음을 재생하는데, 같은 경보음 파일을 사용하는 도어들을 그룹핑하여 중복 재생을 방지하고, 경보 해제 시 자동으로 경보음을 정지하도록 구현했습니다.',
                    challenges: '동일한 경보음 파일을 사용하는 여러 도어에서 동시에 경보가 발생할 때 경보음이 중복 재생되어 소음이 발생했습니다. 또한 브라우저의 자동 재생 정책으로 인해 사용자 인터랙션 없이는 오디오 재생이 차단되는 문제가 있었습니다.',
                    solution: 'Zustand 스토어에 경보음별로 재생 중인 도어 코드 목록을 관리하도록 하여, 같은 경보음은 한 번만 재생하고 여러 도어를 하나의 오디오 인스턴스에 연결하는 방식으로 변경했습니다. 브라우저 자동 재생 정책 문제는 Portal을 활용하여 화면에 "오디오 활성화" 안내 Float 카드를 표시하고, 사용자 클릭으로 오디오 컨텍스트를 초기화하도록 구현했습니다.'
                },
                {
                    id: 'impl-3',
                    title: '생체인식 장치 관리 및 실시간 이벤트 모니터링 UI',
                    description: '지문인식기, 카드리더기 등 생체인식 장치를 추가/삭제하고, 장치별 상세 설정(인증 방식, Wiegand 포맷, 관리자 설정)을 할 수 있는 관리 화면을 구현했습니다. AG Grid를 활용하여 장치 목록을 테이블 형태로 표시하고, 장치 클릭 시 설정 다이얼로그가 열리며 여러 탭(기본 설정/인증 설정/고급 설정)으로 구성된 설정 화면을 제공합니다. WebSocket을 통해 실시간으로 수신되는 생체인식 이벤트(인증 성공/실패, 장치 연결/해제 등)를 별도의 이벤트 창에 표시하여 관제 요원이 현장 상황을 즉시 파악할 수 있도록 했습니다.',
                    challenges: '하나의 위젯으로 동작해야 하므로 React Router를 사용할 수 없어 화면 전환 로직을 별도로 구현해야 했습니다. 또한 장치 설정 변경 시 서버와의 동기화를 유지하면서 사용자 경험을 해치지 않아야 했습니다.',
                    solution: 'useState로 displayMode(deviceList/realTimeEvent/wiegandConfig/adminSetting)를 관리하고, 조건부 렌더링으로 화면을 전환하는 SPA 패턴을 구현했습니다. 장치 설정 변경 시 Zustand의 syncDeviceList에 동기화 중인 장치를 추가하고, Portal을 활용한 Float 카드로 동기화 진행 상태를 표시하여 사용자가 다른 작업을 하면서도 진행 상황을 확인할 수 있도록 했습니다.'
                }
            ],
            challenges: [
                'Konva Canvas 좌표계와 React DnD HTML 좌표계 간의 변환 문제',
                '수백 개 도어 객체의 실시간 렌더링 성능 최적화 (60fps 유지)',
                'WebSocket 메시지 배치 처리 및 상태 업데이트 최적화',
                '같은 경보음 파일을 사용하는 여러 도어의 경보음 중복 재생 방지',
                '브라우저 자동 재생 정책으로 인한 오디오 재생 제약',
                'React Router 없이 복잡한 화면 전환 로직 구현',
            ],
            achievements: [
                'Konva.js를 활용한 고성능 Canvas 기반 실시간 모니터링 시스템 구축',
                'React DnD와 Konva 통합으로 직관적인 도어-경보 드래그 앤 드롭 연결 UI 구현',
                'WebSocket 메시지 배치 처리로 렌더링 성능 최적화 (초당 수백 건의 상태 업데이트 처리)',
                'Web Audio API 기반 경보음 시스템 구현 (같은 경보음 그룹핑, 자동 재생 정책 대응)',
                'Zustand를 활용한 복잡한 상태 관리 (도어 목록, 경보 목록, WebSocket 연결 상태, 오디오 재생 상태)',
                '사용자 친화적인 생체인식 장치 관리 UI (AG Grid, 탭 기반 설정 화면, 실시간 이벤트 모니터링)'
            ],
            retrospective: {
                whatWentWell: [
                    'Konva.js를 활용한 Canvas 기반 복잡한 인터랙션 구현 경험 - 관제 화면에 필요한 줌/팬/드래그/영역 선택 등 모든 기능을 직접 구현하며 Canvas API와 Konva 아키텍처에 대한 깊은 이해를 쌓음',
                    'React DnD와 Konva의 좌표계 통합 문제를 해결하며 서로 다른 라이브러리 간의 통합 방법 학습',
                    'WebSocket 실시간 통신과 React 상태 관리의 조화로운 통합 - STOMP 프로토콜 토픽 구독 패턴과 Zustand의 액션을 연결하여 실시간 데이터를 효율적으로 처리',
                    'Web Audio API를 활용한 경보음 시스템 구현 - AudioContext, AudioBufferSourceNode 등을 활용하여 여러 오디오 파일을 동적으로 로드하고 재생 제어',
                    'AG Grid를 활용한 복잡한 테이블 UI 구현 경험 - 커스텀 셀 렌더러, 인라인 편집, 행 선택 등 엔터프라이즈급 그리드 기능 활용',
                ],
                whatCouldBeImproved: [
                    'Konva Layer 분리 전략을 더 세밀하게 설계했다면 렌더링 성능을 더 개선할 수 있었을 것 - 현재는 배경 이미지와 도어 객체만 분리했지만, 선택 영역, 경보 상태별로 Layer를 더 분리하면 부분 렌더링이 가능',
                    'WebSocket 재연결 로직을 더 견고하게 구현할 필요 - 현재는 단순 재연결만 하지만, 지수 백오프, 최대 재시도 횟수, 연결 상태 UI 표시 등을 추가하면 더 안정적',
                    '컴포넌트 구조를 더 잘게 분리했다면 재사용성과 테스트 가능성이 향상되었을 것 - MapView 컴포넌트가 200줄이 넘어 복잡도가 높음',
                ],
                lessonsLearned: [
                    'Canvas 기반 UI는 DOM 기반보다 렌더링 성능이 우수하지만, 접근성과 SEO가 떨어지므로 데이터 시각화나 관제 화면 등 특정 상황에서만 적합',
                    'Konva의 getRelativePointerPosition()은 Stage에 마우스 위치가 설정된 후에만 사용 가능하므로, 외부 이벤트(React DnD)를 연결할 때는 setPointersPositions()로 먼저 위치를 알려줘야 함',
                    'WebSocket 메시지를 하나씩 처리하면 React의 렌더링 배칭이 제대로 작동하지 않아 성능 저하 발생 - 메시지를 모아서 배치 처리하거나 updateMultipleDoorStatus 같은 일괄 업데이트 액션을 만들어야 함',
                    'Web Audio API의 AudioContext는 사용자 인터랙션 이후에만 resume() 가능하므로, 초기 화면에서 사용자 클릭을 유도하는 UI가 필수',
                    'Zustand의 상태 구조가 너무 깊어지면(중첩된 객체/배열) 불변성 유지가 어려우므로, Immer를 활용하거나 상태를 평탄화하는 것이 좋음',
                    'React 컴포넌트 내에서 Canvas 이벤트 리스너를 등록할 때는 useEffect의 cleanup 함수에서 반드시 제거해야 메모리 누수 방지',
                ]
            }
        },
        {
            id: 'proj-7',
            type: 'project',
            title: '온실가스 차트 웹페이지',
            shortDescription: '한국 온실가스 배출량 데이터 시각화 웹페이지',
            fullDescription: '친구의 아이디어로 시작한 개인 프로젝트로, 한국의 온실가스 배출량 데이터를 시각화하는 웹페이지를 제작했습니다. 웹 개발 연습을 목적으로 React, Chart.js, shadcn/ui를 활용하여 깔끔하고 직관적인 데이터 시각화 인터페이스를 구현했습니다.',
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
            title: '가계부 프로그램',
            shortDescription: '개인 연습용 데스크탑 가계부 애플리케이션',
            fullDescription: '온실가스 차트 웹사이트보다 더 유용한 프로그램을 만들고 싶어서 시작한 개인 연습 프로젝트입니다. Electron 기반 데스크탑 애플리케이션으로 React와 SQLite를 활용하여 실제로 사용할 수 있는 가계부 프로그램을 개발했습니다. 웹 개발 기술을 데스크탑 환경에 적용해보는 학습 목적도 있었습니다.',
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
            title: '온라인 스캠 방지 사이트',
            shortDescription: '스캠 방지 교육 사이트',
            fullDescription: '최근 증가하는 온라인 스캠 피해를 예방하기 위해 개발한 교육용 웹사이트입니다. Next.js와 TypeScript를 활용하여 구축하고, 다양한 스캠 유형과 대응 방법을 시나리오 기반으로 제공합니다.',
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
            title: '다국어 멀티 블로그 포스팅 프로그램',
            shortDescription: 'LLM 자동 번역 및 다중 블로그 플랫폼 포스팅 도구',
            fullDescription: '개발 경험과 지식을 여러 플랫폼에 효율적으로 공유하기 위해 개발한 데스크탑 애플리케이션입니다. LLM API를 활용한 자동 번역 기능과 dev.to, Google Blogger, Qiita 세 개의 블로그 플랫폼 API를 연동하여 다국어 콘텐츠를 동시에 포스팅할 수 있는 도구를 구축했습니다.',
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
        },
        {
            id: 'proj-11',
            type: 'project',
            title: 'WELKIT - 신입사원 온보딩 플랫폼',
            shortDescription: '신입사원을 위한 용어 사전 및 커뮤니티 서비스',
            fullDescription: '신입사원들이 회사 생활에 빠르게 적응할 수 있도록 돕는 온보딩 플랫폼입니다. 온라인에서 모인 개인 개발자들이 "신입사원을 위한 프로젝트"라는 목표에 공감하여 함께 시작한 프로젝트입니다. 업무 용어 학습을 위한 용어 사전, 사용자 정보 관리를 위한 마이페이지, 그리고 신입사원 간 소통을 위한 커뮤니티 기능을 담당하여 개발했습니다.',
            teamSize: 5,
            role: '프론트엔드 개발자 - 용어 사전, 마이페이지, 커뮤니티 담당',
            repository: 'https://github.com/WELKIT/welkit-frontend',
            skills: [
                {
                    id: 'react-welkit',
                    name: 'React',
                    category: 'frontend',
                    usage: '용어 사전, 마이페이지, 커뮤니티 페이지 구현',
                    experience: 'advanced'
                },
                {
                    id: 'typescript-welkit',
                    name: 'TypeScript',
                    category: 'frontend',
                    usage: '타입 안전한 컴포넌트 및 API 통신',
                    experience: 'intermediate'
                },
                {
                    id: 'nextjs-welkit',
                    name: 'Next.js',
                    category: 'frontend',
                    usage: 'App Router, URL 파라미터 기반 라우팅',
                    experience: 'intermediate'
                },
                {
                    id: 'react-query-welkit',
                    name: 'React Query',
                    category: 'frontend',
                    usage: '조건부 쿼리, 낙관적 업데이트, placeholderData를 통한 UX 최적화',
                    experience: 'intermediate'
                },
                {
                    id: 'tailwind-welkit',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '반응형 디자인, 일관된 디자인 시스템',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: 'URL 파라미터 기반 상태 관리로 브라우저 히스토리 활용',
                    description: '커뮤니티 페이지에서 검색어, 카테고리 필터, 페이지네이션, 뷰 모드를 모두 URL 파라미터로 관리하여 브라우저의 뒤로가기/앞으로가기 버튼으로 이전 검색 상태로 돌아갈 수 있게 구현했습니다.',
                    challenges: 'URL과 React 상태를 동기화하고, 불필요한 파라미터는 제거하는 로직 필요',
                    solution: 'Next.js의 useSearchParams와 router.push를 활용하고, updateURL 헬퍼 함수에서 기본값(page=1, category=전체 카테고리 등)은 URL에서 자동 제거하여 깔끔한 URL 유지'
                },
                {
                    id: 'impl-2',
                    title: 'React Query 조건부 쿼리로 불필요한 API 호출 방지',
                    description: '커뮤니티와 용어 사전에서 enabled 옵션을 활용한 조건부 쿼리를 구현했습니다. 검색 모드일 때는 검색 API만, 전체 목록 모드일 때는 전체 목록 API만 호출되도록 제어했습니다.',
                    challenges: '여러 API(전체 목록, 검색, 내 글, 댓글 단 글)가 상황에 따라 선택적으로 호출되어야 함',
                    solution: 'viewMode와 searchQuery 상태에 따라 enabled 조건을 설정하여 필요한 쿼리만 실행되도록 구현'
                },
                {
                    id: 'impl-3',
                    title: 'placeholderData를 활용한 검색 UX 개선',
                    description: '용어 사전에서 검색 중에도 이전 데이터를 표시하여 깜빡임 없는 부드러운 사용자 경험을 제공했습니다.',
                    challenges: '검색어 입력 시마다 화면이 비어서 로딩 표시가 나타나는 불편한 UX',
                    solution: 'React Query의 placeholderData 옵션으로 이전 데이터를 유지하면서 새 데이터를 백그라운드에서 로드'
                },
                {
                    id: 'impl-4',
                    title: '이메일 인증 타이머 구현과 상태 관리',
                    description: '마이페이지의 회사 이메일 인증 다이얼로그에서 180초 타이머를 구현하고, 인증 코드 입력 시간 제한을 UI로 표시했습니다.',
                    challenges: '타이머 메모리 누수 방지와 컴포넌트 언마운트 시 정리 필요',
                    solution: 'setInterval과 clearInterval을 활용하여 1초마다 timeLeft를 감소시키고, 0이 되면 자동으로 타이머를 정리하는 로직 구현'
                },
                {
                    id: 'impl-5',
                    title: '숫자 패드 UI로 PIN 설정 보안 강화',
                    description: '마이페이지에서 키보드 입력이 아닌 화면의 숫자 버튼 클릭으로만 PIN을 설정하도록 구현하여 키로거 공격에 대한 보안을 강화했습니다.',
                    challenges: '4자리 PIN 입력을 직관적이고 안전하게 받는 UI 필요',
                    solution: 'Grid 레이아웃으로 숫자 패드를 구현하고, 버튼 클릭으로만 입력받으며 시각적 피드백(원형 인디케이터)으로 입력 상태 표시'
                },
                {
                    id: 'impl-6',
                    title: '에러 처리 중앙화로 일관된 사용자 피드백',
                    description: '모든 API 에러를 resolveApiError 유틸 함수로 처리하여 백엔드 에러 코드를 사용자 친화적인 메시지로 변환했습니다.',
                    challenges: '각 컴포넌트마다 다른 에러 처리 로직으로 인한 일관성 부족',
                    solution: '중앙 집중식 에러 해석 함수를 만들고, catch 블록에서 항상 이 함수를 통해 에러 메시지를 생성하여 일관된 UX 제공'
                },
                {
                    id: 'impl-7',
                    title: '댓글 입력 컴포넌트 재사용성 설계',
                    description: '댓글 작성, 대댓글 작성, 댓글 수정에서 모두 사용할 수 있도록 CommentInput 컴포넌트를 설계했습니다.',
                    challenges: '각 상황마다 다른 placeholder, 버튼 레이블, 취소 동작이 필요',
                    solution: 'Props로 placeholder, submitLabel, cancelLabel, onCancel을 선택적으로 받아 상황에 맞게 커스터마이징할 수 있도록 설계'
                }
            ],
            challenges: [
                '온라인으로 모인 팀원들과의 원활한 협업',
                'URL 상태와 React 상태의 동기화 복잡도 관리',
                '여러 API 호출 조건에 따른 조건부 쿼리 설계',
                '보안을 고려한 인증 플로우 구현'
            ],
            achievements: [
                'URL 파라미터 기반 상태 관리로 브라우저 네비게이션 완벽 지원',
                'React Query 조건부 쿼리로 불필요한 API 호출 80% 감소',
                'placeholderData로 검색 시 깜빡임 없는 UX 달성',
                '중앙 집중식 에러 처리로 일관된 사용자 피드백 제공'
            ],
            retrospective: {
                whatWentWell: [
                    'URL 파라미터 기반 상태 관리로 사용자가 북마크와 브라우저 히스토리를 자연스럽게 활용',
                    'React Query의 고급 기능(조건부 쿼리, placeholderData)을 활용한 성능 최적화',
                    '재사용 가능한 컴포넌트 설계로 코드 중복 최소화'
                ],
                whatCouldBeImproved: [
                    'URL 파라미터 동기화 로직이 복잡해져 useEffect가 많아짐 - Zustand나 상태관리 라이브러리 도입 고려 필요',
                    '타이머 로직을 커스텀 훅으로 분리하여 재사용성 향상 가능'
                ],
                lessonsLearned: [
                    'URL을 단순한 주소가 아닌 애플리케이션 상태로 활용하면 UX가 크게 개선됨',
                    'React Query의 조건부 쿼리로 불필요한 API 호출을 줄여 성능과 비용 최적화 가능',
                    '에러 처리를 중앙화하면 유지보수성과 일관성이 크게 향상됨',
                    '온라인 협업에서는 명확한 목표와 공감대가 프로젝트 성공의 핵심'
                ]
            }
        },
        {
            id: 'proj-12',
            type: 'project',
            title: '시맨틱 검색 기반 마인드맵 서비스',
            shortDescription: 'AI 임베딩을 활용한 의미적 검색 마인드맵',
            fullDescription: '계층적 지식 구조를 시각화하고, AI 임베딩 기반 시맨틱 검색으로 관련 노드를 자동으로 하이라이트하는 인터랙티브 마인드맵 서비스입니다. 사용자가 검색어를 입력하면 의미적으로 유사한 노드들을 찾아 시각적으로 강조하고, 해당 노드까지의 경로를 자동으로 펼쳐주는 기능을 구현했습니다.',
            teamSize: 3,
            role: '프론트엔드 개발자 - 시맨틱 검색, 시각화, 애니메이션 담당',
            repository: '',
            skills: [
                {
                    id: 'react-mindmap',
                    name: 'React',
                    category: 'frontend',
                    usage: '복잡한 상태 관리, 커스텀 훅 설계, 최적화',
                    experience: 'advanced'
                },
                {
                    id: 'reactflow-advanced',
                    name: 'React Flow',
                    category: 'frontend',
                    usage: '노드/엣지 시각화, 커스텀 노드 컴포넌트, 레이아웃 엔진',
                    experience: 'intermediate'
                },
                {
                    id: 'dagre-layout',
                    name: 'Dagre',
                    category: 'frontend',
                    usage: '계층형 그래프 자동 레이아웃 계산',
                    experience: 'beginner'
                },
                {
                    id: 'ai-embedding',
                    name: 'AI Embedding API',
                    category: 'backend',
                    usage: '텍스트 임베딩 벡터 생성, 코사인 유사도 계산',
                    experience: 'beginner'
                },
                {
                    id: 'tailwind-animation',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '애니메이션, 트랜지션, 반응형 디자인',
                    experience: 'advanced'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '커스텀 훅으로 시맨틱 검색 로직 캡슐화',
                    description: 'useSemanticSearch 커스텀 훅에서 임베딩 초기화, 검색 실행, 하이라이트 관리를 캡슐화하여 메인 컴포넌트의 복잡도를 낮췄습니다.',
                    challenges: '임베딩 생성, 유사도 계산, 상태 관리가 얽혀 있어 로직이 복잡해짐',
                    solution: '관련 로직을 커스텀 훅으로 분리하고, isEmbeddingsReady, highlightedNodes, searchResults 등의 상태를 외부에 노출'
                },
                {
                    id: 'impl-2',
                    title: '유사도 기반 경로 강도 시각화',
                    description: '검색 결과 노드까지의 경로를 찾아 유사도 점수에 따라 연결선의 두께와 스타일을 동적으로 변경하는 시스템을 구현했습니다.',
                    challenges: '여러 검색 결과가 겹치는 경로의 강도를 어떻게 합산하고 시각화할지 결정 필요',
                    solution: 'calculatePathStrengths에서 각 경로의 점수를 합산하고, getVisualStrength로 5단계로 나눠 strokeWidth와 필터 효과를 차등 적용'
                },
                {
                    id: 'impl-3',
                    title: '부드러운 노드 펼치기/접기 애니메이션',
                    description: '노드 확장/축소 시 위치 변화를 추적하여 기존 노드는 이동 애니메이션, 새 노드는 페이드인 효과로 자연스러운 전환을 구현했습니다.',
                    challenges: '노드가 추가/제거될 때 레이아웃이 재계산되면서 급격한 위치 변화 발생',
                    solution: 'currentNodePositions Map으로 이전 위치를 기억하고, isCollapsing 플래그로 접기/펼치기를 구분하여 transition 스타일 적용'
                },
                {
                    id: 'impl-4',
                    title: '검색 결과에 따른 자동 노드 확장',
                    description: '검색 결과로 하이라이트된 노드까지의 전체 경로를 자동으로 펼쳐 사용자가 수동으로 탐색하지 않아도 바로 볼 수 있도록 구현했습니다.',
                    challenges: '깊이 중첩된 노드가 검색되었을 때 부모 노드들을 모두 찾아 펼쳐야 함',
                    solution: 'findPathToNode로 루트부터의 경로를 찾고, useEffect에서 경로상의 모든 노드를 expandedNodes에 추가'
                },
                {
                    id: 'impl-5',
                    title: 'Dagre 레이아웃 엔진 통합',
                    description: 'Dagre 그래프 라이브러리로 계층형 레이아웃을 자동 계산하여 노드가 겹치지 않고 깔끔하게 배치되도록 했습니다.',
                    challenges: 'React Flow의 좌표 시스템과 Dagre의 계산 결과를 매핑하는 과정 필요',
                    solution: 'getLayoutedElements에서 노드 width/height를 Dagre에 전달하고, 계산된 x, y를 React Flow position으로 변환'
                },
                {
                    id: 'impl-6',
                    title: '깊이 기반 노드 색상 시스템',
                    description: '노드의 계층 깊이에 따라 배경색과 테두리 색상을 자동으로 변경하고, 하이라이트 시 강조 테두리를 추가했습니다.',
                    challenges: '계층이 깊어질수록 색상이 부족하고, 하이라이트 상태를 시각적으로 명확히 구분 필요',
                    solution: 'getNodeColorByDepth에서 6단계 색상 배열을 순환하고, isHighlighted 시 청색 강조 테두리 적용'
                },
                {
                    id: 'impl-7',
                    title: '재귀 트리 순회로 노드/엣지 생성',
                    description: '트리 구조의 마인드맵 데이터를 React Flow가 사용하는 평면 노드/엣지 배열로 변환하는 재귀 함수를 구현했습니다.',
                    challenges: 'expandedNodes 상태에 따라 조건부로 자식을 렌더링하고, 엣지도 동적으로 생성해야 함',
                    solution: 'treeToFlowData의 traverse 함수에서 재귀적으로 노드를 순회하며 expandedNodes를 확인하여 선택적으로 자식 처리'
                }
            ],
            challenges: [
                'AI 임베딩 API 호출과 유사도 계산의 성능 최적화',
                '복잡한 트리 구조와 React Flow 상태 동기화',
                '노드 확장/축소 시 부드러운 애니메이션 구현',
                '검색 결과 시각화를 위한 경로 추적 알고리즘 설계'
            ],
            achievements: [
                'AI 임베딩 기반 시맨틱 검색 기능 완성',
                '유사도 점수를 시각적 강도로 변환하는 독창적인 UX 구현',
                'Dagre 레이아웃 엔진으로 자동 노드 배치 구현',
                '재귀 알고리즘과 React 상태 관리의 효율적 결합'
            ],
            retrospective: {
                whatWentWell: [
                    '커스텀 훅으로 복잡한 검색 로직을 깔끔하게 분리',
                    '유사도 점수를 시각적 강도로 변환하여 직관적인 검색 결과 제공',
                    'findPathToNode, calculatePathStrengths 등 재귀 알고리즘을 효과적으로 활용'
                ],
                whatCouldBeImproved: [
                    '팀원 참여 부족으로 프로젝트가 중단되어 실제 서비스까지 이어지지 못함',
                    '임베딩 생성 비용과 성능 최적화 전략 미흡',
                    'useEffect 의존성 배열 관리가 복잡해져 리렌더링 최적화 필요'
                ],
                lessonsLearned: [
                    'AI 임베딩을 실제 프로덕트에 통합하는 경험 습득',
                    '복잡한 그래프 시각화와 레이아웃 엔진 활용 능력 향상',
                    '팀 프로젝트에서 목표 공유와 지속적인 커뮤니케이션의 중요성',
                    '재귀 알고리즘과 React 상태 관리를 결합하는 패턴 학습'
                ]
            }
        },
        {
            id: 'proj-13',
            type: 'project',
            title: '개인 포트폴리오 웹사이트',
            shortDescription: '인터랙티브한 타임라인과 갤러리 기반 포트폴리오',
            fullDescription: '경력과 프로젝트를 시각적으로 표현하는 개인 포트폴리오 웹사이트입니다. 타임라인 페이지에서는 시간 흐름에 따라 경력과 프로젝트를 시각화하고, 갤러리 페이지에서는 카테고리별로 작업물을 정리하여 보여줍니다. Framer Motion을 활용한 부드러운 애니메이션과 반응형 디자인으로 모바일과 데스크탑 모두에서 최적화된 사용자 경험을 제공합니다.',
            teamSize: 1,
            role: '개인 개발자',
            repository: 'https://github.com/yourusername/portfolio',
            skills: [
                {
                    id: 'react-portfolio',
                    name: 'React',
                    category: 'frontend',
                    usage: '컴포넌트 기반 UI 설계, 상태 관리, 커스텀 훅',
                    experience: 'advanced'
                },
                {
                    id: 'typescript-portfolio',
                    name: 'TypeScript',
                    category: 'frontend',
                    usage: '타입 안전성, 인터페이스 설계, 제네릭 활용',
                    experience: 'intermediate'
                },
                {
                    id: 'tailwind-portfolio',
                    name: 'Tailwind CSS',
                    category: 'frontend',
                    usage: '반응형 디자인, 커스텀 디자인 시스템',
                    experience: 'advanced'
                },
                {
                    id: 'framer-motion',
                    name: 'Framer Motion',
                    category: 'frontend',
                    usage: '페이지 전환, 스크롤 애니메이션, 인터랙티브 효과',
                    experience: 'intermediate'
                }
            ],
            implementation: [
                {
                    id: 'impl-1',
                    title: '타임라인 기반 경력 시각화',
                    description: '시간축을 기준으로 경력과 프로젝트를 배치하고, 연관된 항목들을 연결선으로 표시하는 인터랙티브 타임라인을 구현했습니다.',
                    challenges: '복잡한 시간 계산과 레이아웃, sticky 요소의 동작 문제',
                    solution: '월 단위 높이 계산과 연도별 sticky 위치 캐싱, 부모 컨테이너 높이 명시로 해결'
                },
                {
                    id: 'impl-2',
                    title: 'Framer Motion 애니메이션 시스템',
                    description: '페이지 진입, 스크롤, 호버 등 다양한 인터랙션에 부드러운 애니메이션을 적용했습니다.',
                    challenges: '성능 최적화와 애니메이션 타이밍 조절',
                    solution: 'stagger 효과와 lazy loading을 통한 성능 최적화'
                },
                {
                    id: 'impl-3',
                    title: '모바일 최적화 및 반응형 디자인',
                    description: '모바일과 데스크탑에서 각각 최적화된 레이아웃과 네비게이션을 제공합니다.',
                    challenges: 'sticky 요소의 모바일 동작, Float 버튼 패턴 통일',
                    solution: 'matchMedia를 사용한 lazy initialization과 일관된 Float 버튼 패턴 적용'
                }
            ],
            challenges: [
                'CSS sticky 동작의 브라우저별 차이 처리',
                '타임라인 레이아웃의 복잡한 계산 로직',
                '모바일과 데스크탑 UX 차별화'
            ],
            achievements: [
                '인터랙티브한 타임라인 시각화 완성',
                '모바일/데스크탑 최적화된 반응형 디자인 구현',
                'Framer Motion을 활용한 부드러운 사용자 경험 제공',
                '파비콘 및 메타데이터 SEO 최적화'
            ],
            retrospective: {
                whatWentWell: [
                    '타임라인 시각화를 통한 경력의 직관적 표현',
                    'Framer Motion 애니메이션으로 프로페셔널한 느낌 구현',
                    '모바일 환경을 고려한 세심한 UX 설계'
                ],
                whatCouldBeImproved: [
                    '이미지 갤러리 기능 미구현',
                    '다크모드 지원 부재',
                    '다국어 지원 필요'
                ],
                lessonsLearned: [
                    'CSS sticky의 동작 원리와 한계 이해',
                    '복잡한 레이아웃 문제 해결을 위한 근본 원인 분석의 중요성',
                    '일관된 디자인 패턴 유지의 가치'
                ]
            }
        }
    ]
}