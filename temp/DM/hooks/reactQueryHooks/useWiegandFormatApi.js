import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Wiegand 포맷 데이터 가져오기
export const useWiegandFormatList = () => {
    return useQuery({
        queryKey: ['WiegandFormat'],
        queryFn: async () => {
            const response = await fetch('/api/wiegand/formats');
            if (!response.ok) throw new Error('Wiegand Format을 가져오는데 실패했습니다.');
            const data = await response.json();

            return data.map(item => ({
                ...item,
                fieldCount: item.Idfields.length,
            }));
        },
    });
}

// Wiegand 포맷 상세 가져오기
export const useWiegandFormat = (formatId) => {
    return useQuery({
        queryKey: ['WiegandFormat', formatId],
        queryFn: async () => {
            const response = await fetch(`/api/wiegand/formats/${formatId}`);
            if (!response.ok) throw new Error('Wiegand 포맷 상세 가져오기에 실패했습니다.');
            return response.json();
        },
    });
}


// Wiegand 포맷 추가
export const useAddWiegandFormat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newFormat) => {
            const response = await fetch('/api/wiegand/formats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormat),
            });
            if (!response.ok) throw new Error('Wiegand 포맷 추가에 실패했습니다.');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['WiegandFormat'] });
        }
    })
}

// Wiegand 포맷 업데이트
export const useUpdateWiegandFormat = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (updatedFormat) => {
            const response = await fetch(`/api/wiegand/formats/${updatedFormat.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedFormat),
            });
            if (!response.ok) throw new Error('Wiegand 포맷 업데이트에 실패했습니다.');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['WiegandFormat'] });
        }
    })
}

// Wiegand 포맷 제거
export const useRemoveWiegandFormat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formatId) => {
            const promises = formatId.map(async (id) => {
                const response = await fetch(`/api/wiegand/formats/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Wiegand 포맷 제거에 실패했습니다.');
                return response.json();
            });
            return Promise.all(promises);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['WiegandFormat'] });
        }
    })
}

