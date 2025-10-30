/**
 * 통합 메모리 디버거 - DOM/이미지/React 컴포넌트 메모리 누수 진단
 * 
 * 사용법: 브라우저 콘솔에 복사하여 실행
 * 명령어: debugger.stop() - 진단 중지 및 리포트
 */

(function() {
    'use strict';
    
    class MemoryDebugger {
        constructor() {
            this.stats = {
                // 메모리
                memoryStart: performance.memory.usedJSHeapSize / 1048576,
                memoryPeak: 0,
                memoryWarnings: 0,
                memorySpikes: [], // 메모리 급증 시점들
                
                // DOM 요소
                domCreated: 0,
                imagesCreated: 0,
                canvasCreated: 0,
                domNodes: 0,
                
                // 이미지
                imageLoads: 0,
                imageErrors: 0,
                imageMemory: 0,
                
                // Store 데이터
                storeDataSize: 0,
                storeSizeHistory: [],
                
                // React 컴포넌트
                componentMounts: 0,
                componentUnmounts: 0,
                
                // MapView 관련
                mapLoadings: 0,
                backgroundImageLoads: 0
            };
            
            this.domMap = new WeakMap();
            this.imageMap = new WeakMap();
            this.componentMap = new Map();
            this.startTime = Date.now();
            this.isMonitoring = false;
            this.memorySnapshots = [];
        }
        
        start() {
            if (this.isMonitoring) return;
            
            console.clear();
            console.log(`
╔════════════════════════════════════════╗
║   🔍 메모리 디버거 v5.0 - DOM/이미지   ║  
║   MapView 배경이미지 메모리 누수 진단   ║
╚════════════════════════════════════════╝
            `);
            
            this.isMonitoring = true;
            this.interceptAll();
            this.startMonitoring();
            
            console.log('✅ 디버거 시작됨 - DOM/이미지 추적 모드\n');
            console.log('🗺️  MapView를 조작해주세요!\n');
        }
        
        interceptAll() {
            // 1. DOM 요소 가로채기
            this.interceptDOM();
            
            // 2. 이미지 로딩 가로채기
            this.interceptImages();
            
            // 3. Store 데이터 크기 추적
            this.interceptStoreData();
            
            // 4. 콘솔 로그 추적 (MapView 관련)
            this.interceptConsole();
        }
        
        // DOM 요소 생성 추적
        interceptDOM() {
            const self = this;
            
            // createElement 가로채기
            const originalCreateElement = document.createElement.bind(document);
            document.createElement = function(tagName) {
                self.stats.domCreated++;
                const element = originalCreateElement(tagName);
                
                const info = {
                    id: self.stats.domCreated,
                    tag: tagName.toLowerCase(),
                    createdAt: Date.now(),
                    memory: performance.memory.usedJSHeapSize / 1048576
                };
                
                self.domMap.set(element, info);
                
                // 특정 태그만 로그
                if (['canvas', 'img', 'div', 'svg'].includes(info.tag)) {
                    console.log(`🏗️ DOM ${info.tag} #${info.id} 생성 (메모리: ${info.memory.toFixed(0)}MB)`);
                }
                
                return element;
            };
        }
        
        // 이미지 로딩 추적
        interceptImages() {
            const self = this;
            
            // Image 생성자 가로채기
            const OriginalImage = window.Image;
            window.Image = function() {
                self.stats.imagesCreated++;
                const img = new OriginalImage();
                const stack = new Error().stack;
                
                const info = {
                    id: self.stats.imagesCreated,
                    createdAt: Date.now(),
                    memory: performance.memory.usedJSHeapSize / 1048576,
                    fromMapView: stack.includes('MapView') || stack.includes('BackgroundImage')
                };
                
                self.imageMap.set(img, info);
                
                console.log(`🖼️ Image #${info.id} 생성${info.fromMapView ? ' (MapView)' : ''} (메모리: ${info.memory.toFixed(0)}MB)`);
                
                // onload 가로채기
                const originalOnload = img.onload;
                Object.defineProperty(img, 'onload', {
                    set: function(handler) {
                        const wrappedHandler = function(event) {
                            self.stats.imageLoads++;
                            const currentMemory = performance.memory.usedJSHeapSize / 1048576;
                            const memoryDiff = currentMemory - info.memory;
                            
                            console.log(`✅ Image #${info.id} 로드 완료 (+${memoryDiff.toFixed(0)}MB)`);
                            
                            // 이미지 크기 추정
                            if (img.naturalWidth && img.naturalHeight) {
                                const estimatedSize = (img.naturalWidth * img.naturalHeight * 4) / 1024 / 1024; // RGBA
                                self.stats.imageMemory += estimatedSize;
                                console.log(`   크기: ${img.naturalWidth}x${img.naturalHeight} (~${estimatedSize.toFixed(1)}MB)`);
                                
                                if (estimatedSize > 10) {
                                    console.warn(`⚠️ 대용량 이미지: ${estimatedSize.toFixed(1)}MB`);
                                }
                            }
                            
                            if (handler) handler.call(this, event);
                        };
                        originalOnload = wrappedHandler;
                    },
                    get: function() {
                        return originalOnload;
                    }
                });
                
                // onerror 가로채기
                const originalOnerror = img.onerror;
                Object.defineProperty(img, 'onerror', {
                    set: function(handler) {
                        const wrappedHandler = function(event) {
                            self.stats.imageErrors++;
                            console.error(`❌ Image #${info.id} 로드 실패`);
                            if (handler) handler.call(this, event);
                        };
                        originalOnerror = wrappedHandler;
                    },
                    get: function() {
                        return originalOnerror;
                    }
                });
                
                return img;
            };
        }
        
        // Store 데이터 크기 추적
        interceptStoreData() {
            const self = this;
            
            // 주기적으로 Store 크기 측정
            setInterval(() => {
                let totalSize = 0;
                const storeInfo = {};
                
                // doorMonitoringStore
                if (window.useDoorMonitoringStore) {
                    const store = window.useDoorMonitoringStore.getState();
                    const storeString = JSON.stringify(store);
                    const sizeInMB = new Blob([storeString]).size / 1048576;
                    totalSize += sizeInMB;
                    storeInfo.doorMonitoring = sizeInMB;
                    
                    // 개별 항목 크기
                    ['mapDisplayDoorList', 'doorList', 'alertList', 'pendingChanges'].forEach(key => {
                        if (store[key]) {
                            const itemSize = new Blob([JSON.stringify(store[key])]).size / 1048576;
                            if (itemSize > 1) { // 1MB 이상만 표시
                                storeInfo[key] = itemSize;
                            }
                        }
                    });
                }
                
                self.stats.storeDataSize = totalSize;
                self.stats.storeSizeHistory.push({
                    time: Date.now(),
                    size: totalSize,
                    details: storeInfo
                });
                
                // 크기 급증 감지
                if (self.stats.storeSizeHistory.length > 1) {
                    const prev = self.stats.storeSizeHistory[self.stats.storeSizeHistory.length - 2];
                    const diff = totalSize - prev.size;
                    
                    if (diff > 10) { // 10MB 이상 증가
                        console.error(`📊 Store 데이터 급증: +${diff.toFixed(1)}MB`);
                        console.table(storeInfo);
                    }
                }
                
                // 히스토리 정리 (최근 10개만)
                if (self.stats.storeSizeHistory.length > 10) {
                    self.stats.storeSizeHistory.shift();
                }
            }, 5000);
        }
        
        // 콘솔 로그 추적 (MapView 관련)
        interceptConsole() {
            const self = this;
            const originalLog = console.log;
            
            console.log = function(...args) {
                const message = args.join(' ');
                
                // MapView 관련 로그 감지
                if (message.includes('[MapLoading]')) {
                    const currentMemory = performance.memory.usedJSHeapSize / 1048576;
                    
                    if (message.includes('로딩 시작')) {
                        self.stats.mapLoadings++;
                        console.log(`🗺️ MapLoading 시작 #${self.stats.mapLoadings} (메모리: ${currentMemory.toFixed(0)}MB)`);
                        self.mapLoadingStartMemory = currentMemory;
                    }
                    
                    if (message.includes('배경 이미지 로드 완료')) {
                        self.stats.backgroundImageLoads++;
                        const memoryDiff = self.mapLoadingStartMemory ? currentMemory - self.mapLoadingStartMemory : 0;
                        console.log(`🖼️ 배경 이미지 로드 완료 #${self.stats.backgroundImageLoads} (+${memoryDiff.toFixed(0)}MB)`);
                        
                        if (memoryDiff > 50) {
                            console.error(`⚠️ 배경 이미지 로딩으로 ${memoryDiff.toFixed(0)}MB 증가!`);
                            self.analyzeNow();
                        }
                    }
                }
                
                originalLog.apply(console, args);
            };
        }
        
        // 메모리 스냅샷 저장
        captureMemorySnapshot(reason) {
            const snapshot = {
                time: Date.now(),
                reason: reason,
                memory: performance.memory.usedJSHeapSize / 1048576,
                dom: document.querySelectorAll('*').length,
                images: this.stats.imagesCreated,
                storeSize: this.stats.storeDataSize
            };
            
            this.memorySnapshots.push(snapshot);
            
            // 최근 20개만 유지
            if (this.memorySnapshots.length > 20) {
                this.memorySnapshots.shift();
            }
            
            return snapshot;
        }
        
        startMonitoring() {
            const self = this;
            
            this.monitorInterval = setInterval(() => {
                const current = performance.memory.usedJSHeapSize / 1048576;
                const diff = current - this.stats.memoryStart;
                
                if (current > this.stats.memoryPeak) {
                    this.stats.memoryPeak = current;
                }
                
                // DOM 노드 개수
                this.stats.domNodes = document.querySelectorAll('*').length;
                
                // 상태 표시
                const status = diff > 2000 ? '🔴' : diff > 1000 ? '🟡' : '🟢';
                
                console.log(
                    `${status} 메모리: ${current.toFixed(0)}MB (+${diff.toFixed(0)}MB) | ` +
                    `DOM: ${this.stats.domNodes}개 | 이미지: ${this.stats.imagesCreated}개 | ` +
                    `Store: ${this.stats.storeDataSize.toFixed(1)}MB`
                );
                
                // 메모리 급증 감지
                if (diff > 1000) {
                    this.stats.memoryWarnings++;
                    
                    // 스냅샷 저장
                    this.captureMemorySnapshot('memory-spike');
                    
                    console.error(`🚨 메모리 ${diff.toFixed(0)}MB 증가!`);
                    this.analyzeNow();
                }
                
                // 5GB 도달 시 자동 종료
                if (diff > 5000) {
                    console.error('💀 메모리 5GB 증가! 자동 종료!');
                    this.stop();
                }
            }, 2000);
        }
        
        analyzeNow() {
            console.group('🔍 메모리 급증 분석');
            
            const current = performance.memory.usedJSHeapSize / 1048576;
            const diff = current - this.stats.memoryStart;
            
            console.log('📊 현재 상태:');
            console.log(`- 메모리: ${current.toFixed(0)}MB (+${diff.toFixed(0)}MB)`);
            console.log(`- DOM 노드: ${this.stats.domNodes}개`);
            console.log(`- 생성된 이미지: ${this.stats.imagesCreated}개`);
            console.log(`- 로드된 이미지: ${this.stats.imageLoads}개`);
            console.log(`- 이미지 메모리: ~${this.stats.imageMemory.toFixed(1)}MB`);
            console.log(`- Store 크기: ${this.stats.storeDataSize.toFixed(1)}MB`);
            console.log(`- MapView 로딩: ${this.stats.mapLoadings}회`);
            console.log(`- 배경이미지 로드: ${this.stats.backgroundImageLoads}회`);
            
            // Store 상세 분석
            if (window.useDoorMonitoringStore && this.stats.storeSizeHistory.length > 0) {
                const latest = this.stats.storeSizeHistory[this.stats.storeSizeHistory.length - 1];
                console.log('\n📊 Store 상세:');
                console.table(latest.details);
            }
            
            // 메모리 스냅샷 비교
            if (this.memorySnapshots.length >= 2) {
                console.log('\n📈 메모리 변화 패턴:');
                const recent = this.memorySnapshots.slice(-5);
                console.table(recent.map(s => ({
                    시간: new Date(s.time).toLocaleTimeString(),
                    이유: s.reason,
                    메모리: s.memory.toFixed(0) + 'MB',
                    DOM: s.dom,
                    이미지: s.images
                })));
            }
            
            // 위험 요소 분석
            console.log('\n⚠️ 위험 요소:');
            if (this.stats.imageMemory > 100) {
                console.error(`- 이미지 메모리 과다: ${this.stats.imageMemory.toFixed(1)}MB`);
            }
            if (this.stats.domNodes > 10000) {
                console.error(`- DOM 노드 과다: ${this.stats.domNodes}개`);
            }
            if (this.stats.storeDataSize > 50) {
                console.error(`- Store 데이터 과다: ${this.stats.storeDataSize.toFixed(1)}MB`);
            }
            if (this.stats.backgroundImageLoads > 10) {
                console.error(`- 배경이미지 반복 로드: ${this.stats.backgroundImageLoads}회`);
            }
            
            console.groupEnd();
        }
        
        stop() {
            if (!this.isMonitoring) return;
            
            clearInterval(this.monitorInterval);
            this.isMonitoring = false;
            
            const duration = (Date.now() - this.startTime) / 1000;
            const finalMemory = performance.memory.usedJSHeapSize / 1048576;
            const totalDiff = finalMemory - this.stats.memoryStart;
            
            console.group('📋 최종 진단 리포트');
            
            console.log(`⏱️ 진단 시간: ${duration.toFixed(0)}초`);
            
            console.log('\n💾 메모리:');
            console.log(`- 시작: ${this.stats.memoryStart.toFixed(0)}MB`);
            console.log(`- 최종: ${finalMemory.toFixed(0)}MB`);
            console.log(`- 최고: ${this.stats.memoryPeak.toFixed(0)}MB`);
            console.log(`- 증가: ${totalDiff.toFixed(0)}MB`);
            console.log(`- 경고: ${this.stats.memoryWarnings}회`);
            
            console.log('\n🏗️ DOM/이미지:');
            console.log(`- DOM 생성: ${this.stats.domCreated}개`);
            console.log(`- 최종 DOM 노드: ${this.stats.domNodes}개`);
            console.log(`- 이미지 생성: ${this.stats.imagesCreated}개`);
            console.log(`- 이미지 로드: ${this.stats.imageLoads}개`);
            console.log(`- 이미지 에러: ${this.stats.imageErrors}개`);
            console.log(`- 추정 이미지 메모리: ${this.stats.imageMemory.toFixed(1)}MB`);
            
            console.log('\n🗺️ MapView:');
            console.log(`- 맵 로딩: ${this.stats.mapLoadings}회`);
            console.log(`- 배경이미지 로드: ${this.stats.backgroundImageLoads}회`);
            
            console.log('\n📊 Store:');
            console.log(`- 최종 Store 크기: ${this.stats.storeDataSize.toFixed(1)}MB`);
            
            // 진단 결과
            console.log('\n🏥 진단 결과:');
            
            if (totalDiff > 2000) {
                console.error('🔴 심각한 메모리 누수 확인!');
                
                if (this.stats.imageMemory > 500) {
                    console.error('→ 원인: 이미지 메모리 누수');
                    console.error('→ 해결: 이미지 객체 정리 로직 추가 필요');
                } else if (this.stats.backgroundImageLoads > 20) {
                    console.error('→ 원인: 배경이미지 반복 로드');
                    console.error('→ 해결: 이미지 캐싱 구현 필요');
                } else if (this.stats.storeDataSize > 100) {
                    console.error('→ 원인: Store 데이터 과다 누적');
                    console.error('→ 해결: Store 데이터 정리 로직 필요');
                } else {
                    console.error('→ 원인: 기타 (Canvas, Blob 등)');
                }
                
            } else if (totalDiff > 1000) {
                console.warn('🟡 메모리 누수 가능성');
                console.warn('→ 모니터링 지속 필요');
            } else {
                console.log('🟢 정상 범위');
            }
            
            // 최종 분석
            this.analyzeNow();
            
            console.groupEnd();
        }
    }
    
    // 전역 객체 생성 및 자동 시작
    window.debugger = new MemoryDebugger();
    window.debugger.start();
    
    // 사용법 안내
    console.log('📌 명령어:');
    console.log('- debugger.stop() : 진단 중지 및 리포트');
    console.log('- debugger.analyzeNow() : 즉시 분석');
    console.log('- debugger.captureMemorySnapshot("이유") : 스냅샷 저장\n');
    
})();