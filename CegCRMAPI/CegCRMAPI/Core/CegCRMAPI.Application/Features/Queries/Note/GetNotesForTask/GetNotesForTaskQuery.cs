using AutoMapper;
using CegCRMAPI.Application.DTOs.Note;
using CegCRMAPI.Application.DTOs.Common;
using CegCRMAPI.Application.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace CegCRMAPI.Application.Features.Queries.Note.GetNotesForTask
{
    public class GetNotesForTaskQuery : IRequest<ApiResponse<List<NoteDto>>>
    {
        public Guid TaskId { get; set; }
    }

    public class GetNotesForTaskQueryHandler : IRequestHandler<GetNotesForTaskQuery, ApiResponse<List<NoteDto>>>
    {
        private readonly INoteRepository _noteRepository;
        private readonly IMapper _mapper;

        public GetNotesForTaskQueryHandler(INoteRepository noteRepository, IMapper mapper)
        {
            _noteRepository = noteRepository;
            _mapper = mapper;
        }

        public async Task<ApiResponse<List<NoteDto>>> Handle(GetNotesForTaskQuery request, CancellationToken cancellationToken)
        {
            try
            {
                var notes = await _noteRepository.GetNotesByTaskIdAsync(request.TaskId);
                var noteDtos = _mapper.Map<List<NoteDto>>(notes);
                return ApiResponse<List<NoteDto>>.CreateSuccess(noteDtos, "Notes retrieved successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<NoteDto>>.CreateError($"Failed to retrieve notes: {ex.Message}");
            }
        }
    }
} 